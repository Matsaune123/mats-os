use actix_web::{
    get,
    post,
    web,
    HttpResponse,
    Responder,
};

use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex, MutexGuard};

pub type LoadingState = Arc<Mutex<GameState>>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PuzzleType {
    Rotation,
    Choice,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameState {
    pub progress: i32,
    pub angle: i32,
    pub waiting_for_puzzle: bool,
    pub puzzle_type: PuzzleType,
    pub question: String,
    pub answers: Vec<String>,
    pub correct_answer: usize,
    pub completed: bool,
}

impl Default for GameState {
    fn default() -> Self {
        Self {
            progress: 0,
            angle: 45,
            waiting_for_puzzle: false,
            puzzle_type: PuzzleType::Rotation,
            question: String::new(),
            answers: Vec::new(),
            correct_answer: 0,
            completed: false,
        }
    }
}

#[derive(Serialize)]
pub struct StateResponse {
    pub progress: i32,
    pub angle: i32,
    pub waiting_for_puzzle: bool,
    pub puzzle_type: String,
    pub question: String,
    pub answers: Vec<String>,
    pub completed: bool,
}

#[derive(Deserialize)]
pub struct RotateRequest {
    pub amount: i32,
}

#[derive(Deserialize)]
pub struct AnswerRequest {
    pub answer_index: usize,
}

fn lock_game<'a>(
    state: &'a web::Data<LoadingState>,
) -> Result<MutexGuard<'a, GameState>, HttpResponse> {
    match state.lock() {
        Ok(game) => Ok(game),

        Err(_) => Err(
            HttpResponse::InternalServerError().json(
                serde_json::json!({
                    "error": "Unable to access game state"
                })
            )
        ),
    }
}

fn create_question(game: &mut GameState) {
    let puzzle_number = (game.progress / 15) % 4;

    match puzzle_number {
        0 => {
            game.question =
                "Hva forbedrer lagringsytelsen?".to_string();

            game.answers = vec![
                "SSD".to_string(),
                "Delete System32".to_string(),
                "Slå av skjermen".to_string(),
            ];

            game.correct_answer = 0;
        }

        1 => {
            game.question =
                "Serveren svarer ikke.".to_string();

            game.answers = vec![
                "Restart tjenesten".to_string(),
                "Hell vann på PC-en".to_string(),
                "Kast ruteren".to_string(),
            ];

            game.correct_answer = 0;
        }

        2 => {
            game.question =
                "Maskinen mangler RAM.".to_string();

            game.answers = vec![
                "Installer RAM".to_string(),
                "Åpne flere faner".to_string(),
                "Slå på Caps Lock".to_string(),
            ];

            game.correct_answer = 0;
        }

        _ => {
            game.question =
                "Disken er full.".to_string();

            game.answers = vec![
                "Rydd temporære filer".to_string(),
                "Installer Windows igjen".to_string(),
                "Ta skjermbilde".to_string(),
            ];

            game.correct_answer = 0;
        }
    }
}

#[get("/api/loading/state")]
pub async fn get_state(
    state: web::Data<LoadingState>,
) -> impl Responder {

    let game = match lock_game(&state) {
        Ok(game) => game,
        Err(response) => return response,
    };

    let puzzle_name = match game.puzzle_type {
        PuzzleType::Rotation => "rotation",
        PuzzleType::Choice => "choice",
    };

    HttpResponse::Ok().json(
        StateResponse {
            progress: game.progress,
            angle: game.angle,
            waiting_for_puzzle: game.waiting_for_puzzle,
            puzzle_type: puzzle_name.to_string(),
            question: game.question.clone(),
            answers: game.answers.clone(),
            completed: game.completed,
        }
    )
}

#[post("/api/loading/rotate")]
pub async fn rotate(
    state: web::Data<LoadingState>,
    request: web::Json<RotateRequest>,
) -> impl Responder {
    let mut game = match lock_game(&state) {
        Ok(game) => game,
        Err(response) => return response,
    };

    if game.completed {
        return HttpResponse::Ok().json(&*game);
    }

    // FJERNET: if game.waiting_for_puzzle { return ... }

    game.angle += request.amount;

    if game.angle > 180 {
        game.angle = -180;
    }

    if game.angle < -180 {
        game.angle = 180;
    }

    // Sjekk om vi skal trigge puzzle (bare hvis vi ikke allerede har et)
    if game.angle.abs() <= 5 && !game.waiting_for_puzzle {
        game.waiting_for_puzzle = true;
        game.puzzle_type = PuzzleType::Choice;
        create_question(&mut game);
    }

    HttpResponse::Ok().json(&*game)
}

#[post("/api/loading/answer")]
pub async fn answer(
    state: web::Data<LoadingState>,
    request: web::Json<AnswerRequest>,
) -> impl Responder {

    let mut game = match lock_game(&state) {
        Ok(game) => game,
        Err(response) => return response,
    };

    if !game.waiting_for_puzzle {
        return HttpResponse::BadRequest().json(
            serde_json::json!({
                "error": "No active puzzle"
            })
        );
    }

    if request.answer_index == game.correct_answer {

        game.progress += 15;

        if game.progress > 100 {
            game.progress = 100;
        }

    } else {

        game.progress -= 10;

        if game.progress < 0 {
            game.progress = 0;
        }
    }

        game.waiting_for_puzzle = false;

    game.question.clear();
    game.answers.clear();

    if game.progress >= 100 {
        game.completed = true;
    }

    HttpResponse::Ok().json(&*game)
}

#[post("/api/loading/reset")]
pub async fn reset(
    state: web::Data<LoadingState>,
) -> impl Responder {

    let mut game = match lock_game(&state) {
        Ok(game) => game,
        Err(response) => return response,
    };

    *game = GameState::default();

    HttpResponse::Ok().json(&*game)
}