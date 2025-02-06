use rusqlite::{Connection, Result};
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use serde::Serialize;
use std::env;
use dotenvy::dotenv;

#[derive(Debug, Serialize)]
struct Leaderboard {
    player_id: String,
    name: String,
    score: i32,
}

#[derive(Debug, Serialize)]
struct ErrorResponse {
    message: String,
}

fn get_leaderboard_from_db(lobby_code: String) -> Result<Vec<Leaderboard>> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let conn = Connection::open(database_url)?;
    
    let mut stmt = conn.prepare(
        "
        SELECT p.playerId, p.name, p.score
        FROM Players p
        INNER JOIN Lobbys l ON p.lobbyId = l.lobbyId
        WHERE l.lobbyCode = ?
        ORDER BY p.score DESC;
        "
    )?;
    
    let leaderboard_iter = stmt.query_map([lobby_code], |row| {
        Ok(Leaderboard {
            player_id: row.get(0)?,
            name: row.get(1)?,
            score: row.get(2)?,
        })
    })?;
    
    let mut results = Vec::new();
    for leaderboard in leaderboard_iter {
        results.push(leaderboard?);
    }
    
    Ok(results)
}

#[get("/leaderboard/{lobbyCode}")]
async fn get_leaderboard(lobby_code: web::Path<String>) -> impl Responder {
    let lobby_code = lobby_code.into_inner();
    
    match get_leaderboard_from_db(lobby_code) {
        Ok(leaderboard) => {
            HttpResponse::Ok().json(leaderboard)
        },
        Err(e) => {
            HttpResponse::InternalServerError().json(ErrorResponse {
                message: format!("Erreur: {}", e),
            })
        }
    } 
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new().service(get_leaderboard)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
