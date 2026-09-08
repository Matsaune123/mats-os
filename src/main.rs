use actix::prelude::*;
use actix_files::Files;
use actix_web::{
    cookie::{Cookie, SameSite},
    get, post, web, App, Error, HttpRequest, HttpResponse, HttpServer, Responder,
};
use actix_web_actors::ws;
use rand::RngCore;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tokio::fs;

type Sessions = Arc<Mutex<HashMap<String, bool>>>;
type WritingFlag = Arc<Mutex<bool>>;

#[derive(Message)]
#[rtype(result = "()")]
struct WsMessage(pub String);

struct ChatServer {
    sessions: HashMap<usize, Recipient<WsMessage>>,
    players: HashMap<String, Player>,
    rng: usize,
}

impl ChatServer {
    fn new() -> Self {
        Self {
            sessions: HashMap::new(),
            players: HashMap::new(),
            rng: 0,
        }
    }
}

impl Actor for ChatServer {
    type Context = Context<Self>;
}

#[derive(Message)]
#[rtype(result = "usize")]
struct Connect {
    addr: Recipient<WsMessage>,
}

#[derive(Message)]
#[rtype(result = "()")]
struct Disconnect {
    id: usize,
    player_id: Option<String>,
}

#[derive(Message)]
#[rtype(result = "()")]
struct Broadcast {
    msg: String,
}

impl Handler<Connect> for ChatServer {
    type Result = usize;

    fn handle(&mut self, msg: Connect, _ctx: &mut Context<Self>) -> Self::Result {
        self.rng = self.rng.wrapping_add(1);
        let id = self.rng;
        self.sessions.insert(id, msg.addr);
        id
    }
}

impl Handler<Disconnect> for ChatServer {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _ctx: &mut Context<Self>) {
        self.sessions.remove(&msg.id);
        if let Some(pid) = msg.player_id {
            self.players.remove(&pid);
            let broadcast_msg = serde_json::json!({
                "type": "playerDisconnected",
                "id": pid
            })
            .to_string();

            for recp in self.sessions.values() {
                let _ = recp.do_send(WsMessage(broadcast_msg.clone()));
            }
        }
    }
}

impl Handler<Broadcast> for ChatServer {
    type Result = ();

    fn handle(&mut self, msg: Broadcast, _ctx: &mut Context<Self>) {
        for recp in self.sessions.values() {
            let _ = recp.do_send(WsMessage(msg.msg.clone()));
        }
    }
}

#[derive(Message)]
#[rtype(result = "()")]
struct SetPlayer {
    player: Player,
}

impl Handler<SetPlayer> for ChatServer {
    type Result = ();

    fn handle(&mut self, msg: SetPlayer, _ctx: &mut Context<Self>) {
        self.players.insert(msg.player.id.clone(), msg.player);

        let serialized_players = serde_json::json!({
            "type": "currentPlayers",
            "players": self.players
        })
        .to_string();

        for recp in self.sessions.values() {
            let _ = recp.do_send(WsMessage(serialized_players.clone()));
        }
    }
}

#[derive(Clone)]
struct AppState {
    sessions: Sessions,
    is_writing: WritingFlag,
    posts_path: String,
    chat_addr: Addr<ChatServer>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct NewPost {
    title: String,
    date: String,
    timestamp: String,
    content: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Post {
    id: usize,
    title: String,
    date: String,
    timestamp: String,
    content: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct LoginPayload {
    user: String,
    pass: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Player {
    id: String,
    x: i32,
    y: i32,
    name: String,
    color: String,
}

fn escape_html(s: &str) -> String {
    s.chars()
        .map(|c| match c {
            '&' => "&amp;".to_string(),
            '<' => "&lt;".to_string(),
            '>' => "&gt;".to_string(),
            '\'' => "&#39;".to_string(),
            '"' => "&quot;".to_string(),
            other => other.to_string(),
        })
        .collect()
}

fn is_valid_hex_color(color: &str) -> bool {
    color.len() == 7
        && color.starts_with('#')
        && color[1..].chars().all(|c| c.is_ascii_hexdigit())
}

#[post("/api/login")]
async fn login(data: web::Data<AppState>, payload: web::Json<LoginPayload>) -> impl Responder {
    let admin_user = std::env::var("ADMIN_USER").unwrap_or_default();
    let admin_pass = std::env::var("ADMIN_PASS").unwrap_or_default();

    if !admin_user.is_empty() && payload.user == admin_user && payload.pass == admin_pass {
        let mut buf = [0u8; 32];
        rand::rngs::OsRng.fill_bytes(&mut buf);
        let token = hex::encode(buf);

        if let Ok(mut sessions) = data.sessions.lock() {
            sessions.insert(token.clone(), true);
        } else {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "success": false,
                "error": "Session store unavailable"
            }));
        }

        let cookie = Cookie::build("session", token)
            .http_only(true)
            .same_site(SameSite::Strict)
            .finish();

        return HttpResponse::Ok().cookie(cookie).json(serde_json::json!({"success": true}));
    }

    HttpResponse::Unauthorized().json(serde_json::json!({"success": false}))
}

#[post("/api/logout")]
async fn logout(data: web::Data<AppState>, req: HttpRequest) -> impl Responder {
    if let Some(cookie) = req.cookie("session") {
        let token = cookie.value().to_string();
        if let Ok(mut sessions) = data.sessions.lock() {
            sessions.remove(&token);
        }
    }

    let cookie = Cookie::build("session", "")
        .http_only(true)
        .same_site(SameSite::Strict)
        .finish();
    HttpResponse::Ok().cookie(cookie).json(serde_json::json!({"success": true}))
}

#[get("/api/checksession")]
async fn checksession(data: web::Data<AppState>, req: HttpRequest) -> impl Responder {
    let logged_in = match req.cookie("session") {
        Some(cookie) => {
            let token = cookie.value();
            data.sessions
                .lock()
                .map(|sessions| sessions.contains_key(token))
                .unwrap_or(false)
        }
        None => false,
    };

    HttpResponse::Ok().json(serde_json::json!({"loggedIn": logged_in}))
}

#[post("/api/newpost")]
async fn newpost(
    data: web::Data<AppState>,
    req: HttpRequest,
    payload: web::Json<NewPost>,
) -> impl Responder {
    let token = req.cookie("session").map(|c| c.value().to_string());
    let is_authorized = match token.as_ref() {
        Some(token_value) => data
            .sessions
            .lock()
            .map(|sessions| sessions.contains_key(token_value))
            .unwrap_or(false),
        None => false,
    };

    if !is_authorized {
        return HttpResponse::Forbidden().json(serde_json::json!({"error": "Access denied"}));
    }

    let write_lock = match data.is_writing.lock() {
        Ok(mut writing) => {
            if *writing {
                return HttpResponse::ServiceUnavailable().json(serde_json::json!({
                    "error": "Database locked. Try again in a second."
                }));
            }
            *writing = true;
            true
        }
        Err(_) => false,
    };

    let posts_path = data.posts_path.clone();
    let post = payload.into_inner();
    let result = async move {
        let content = fs::read_to_string(&posts_path)
            .await
            .unwrap_or_else(|_| "[]".to_string());

        let mut posts: Vec<Post> = serde_json::from_str(&content).unwrap_or_default();

        let new_post = Post {
            id: posts.len() + 1,
            title: escape_html(&post.title),
            date: escape_html(&post.date),
            timestamp: escape_html(&post.timestamp),
            content: escape_html(&post.content),
        };

        posts.push(new_post.clone());

        if let Ok(serialized) = serde_json::to_string_pretty(&posts) {
            if fs::write(&posts_path, serialized).await.is_ok() {
                return Ok::<Post, ()>(new_post);
            }
        }
        Err(())
    }
    .await;

    if write_lock {
        if let Ok(mut writing) = data.is_writing.lock() {
            *writing = false;
        }
    }

    match result {
        Ok(p) => HttpResponse::Ok().json(serde_json::json!({"success": true, "post": p})),
        Err(_) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Server failure while writing to file"
        })),
    }
}

#[get("/api/posts")]
async fn get_posts(data: web::Data<AppState>) -> impl Responder {
    match fs::read_to_string(&data.posts_path).await {
        Ok(s) => HttpResponse::Ok().content_type("application/json").body(s),
        Err(_) => HttpResponse::InternalServerError()
            .json(serde_json::json!({"error": "Could not read posts"})),
    }
}

async fn ws_index(
    req: HttpRequest,
    stream: web::Payload,
    data: web::Data<AppState>,
) -> Result<HttpResponse, Error> {
    let srv = WsSession::new(data.chat_addr.clone());
    ws::start(srv, &req, stream)
}

struct WsSession {
    id: usize,
    player_id: String,
    chat_addr: Addr<ChatServer>,
}

impl WsSession {
    fn new(chat_addr: Addr<ChatServer>) -> Self {
        Self {
            id: 0,
            player_id: uuid::Uuid::new_v4().to_string(),
            chat_addr,
        }
    }
}

impl Actor for WsSession {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        let addr = ctx.address();
        let recip = addr.recipient::<WsMessage>();
        let chat = self.chat_addr.clone();

        ctx.text(
            serde_json::json!({
                "type": "init",
                "id": self.player_id
            })
            .to_string(),
        );

        async move { chat.send(Connect { addr: recip }).await }
            .into_actor(self)
            .then(|res, act, ctx| {
                if let Ok(id) = res {
                    act.id = id;
                    let player = Player {
                        id: act.player_id.clone(),
                        x: 400,
                        y: 250,
                        name: "Anonymous".to_string(),
                        color: "#0076ff".to_string(),
                    };
                    act.chat_addr.do_send(SetPlayer { player });
                } else {
                    ctx.stop();
                }
                async {}.into_actor(act)
            })
            .wait(ctx);
    }

    fn stopped(&mut self, _ctx: &mut Self::Context) {
        let _ = self.chat_addr.do_send(Disconnect {
            id: self.id,
            player_id: Some(self.player_id.clone()),
        });
    }
}

impl Handler<WsMessage> for WsSession {
    type Result = ();

    fn handle(&mut self, msg: WsMessage, ctx: &mut ws::WebsocketContext<Self>) {
        ctx.text(msg.0);
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WsSession {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut ws::WebsocketContext<Self>) {
        match msg {
            Ok(ws::Message::Text(text)) => {
                if let Ok(v) = serde_json::from_str::<serde_json::Value>(&text) {
                    if let Some(t) = v.get("type").and_then(|x| x.as_str()) {
                        match t {
                            "join" | "movement" => {
                                let x = v.get("x").and_then(|x| x.as_i64()).unwrap_or(400) as i32;
                                let y = v.get("y").and_then(|y| y.as_i64()).unwrap_or(250) as i32;
                                let name = v.get("name").and_then(|n| n.as_str()).unwrap_or("Anonymous");
                                let color = v.get("color").and_then(|c| c.as_str()).unwrap_or("#0076ff");

                                let clean_name = escape_html(name);
                                let clean_color = if is_valid_hex_color(color) {
                                    color.to_string()
                                } else {
                                    "#0076ff".to_string()
                                };

                                let player = Player {
                                    id: self.player_id.clone(),
                                    x: x.clamp(20, 780),
                                    y: y.clamp(20, 480),
                                    name: clean_name.chars().take(21).collect(),
                                    color: clean_color,
                                };
                                self.chat_addr.do_send(SetPlayer { player });
                            }
                            "chatMessage" => {
                                if let Some(msgv) = v.get("msg").and_then(|m| m.as_str()) {
                                    let clean = escape_html(msgv);
                                    if !clean.is_empty() {
                                        if let Ok(mjson) = serde_json::to_string(&serde_json::json!({
                                            "type": "chatMessage",
                                            "id": self.player_id,
                                            "msg": clean
                                        })) {
                                            self.chat_addr.do_send(Broadcast { msg: mjson });
                                        }
                                    }
                                }
                            }
                            _ => {}
                        }
                    }
                }
            }
            Ok(ws::Message::Ping(msg)) => ctx.pong(&msg),
            Ok(ws::Message::Close(_)) => ctx.stop(),
            _ => {}
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let posts_path = std::env::current_dir()
        .map(|dir| dir.join("posts.json"))
        .unwrap_or_else(|_| std::path::PathBuf::from("posts.json"));
    let posts_path = posts_path.to_string_lossy().to_string();

    let chat_srv = ChatServer::new().start();

    let state = AppState {
        sessions: Arc::new(Mutex::new(HashMap::new())),
        is_writing: Arc::new(Mutex::new(false)),
        posts_path,
        chat_addr: chat_srv,
    };

    let port = std::env::var("PORT")
        .ok()
        .and_then(|value| value.parse::<u16>().ok())
        .unwrap_or(10000);

    println!("Starter server på port {}", port);

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(state.clone()))
            .service(login)
            .service(logout)
            .service(checksession)
            .service(newpost)
            .service(get_posts)
            .route("/ws/", web::get().to(ws_index))
            .service(Files::new("/", "public").index_file("index.html"))
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
