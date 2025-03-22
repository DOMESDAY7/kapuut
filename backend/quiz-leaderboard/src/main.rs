use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use serde::Serialize;
use std::env;
use dotenvy::dotenv;
use tokio_postgres::{NoTls, Error};
use actix_cors::Cors;

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

async fn get_leaderboard_from_db(lobby_code: String) -> Result<Vec<Leaderboard>, Error> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let (client, connection) = tokio_postgres::connect(database_url.as_str(), NoTls).await?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    let query = "
        SELECT p.\"playerId\", p.\"name\", p.\"score\"
        FROM \"Players\" p
        INNER JOIN \"Lobbys\" l ON p.\"lobbyId\" = l.\"lobbyId\"
        WHERE l.\"lobbyCode\" = $1
        ORDER BY p.\"score\" DESC;
    ";

    let rows = client
        .query(query, &[&lobby_code])
        .await?;

    let leaderboard_iter = rows.iter().map(|row| {
        Ok(Leaderboard {
            player_id: row.get(0),
            name: row.get(1),
            score: row.get(2),
        })
    });

    let mut results = Vec::new();
    for leaderboard in leaderboard_iter {
        results.push(leaderboard?);
    }
    
    Ok(results)
}

#[get("/leaderboard/{lobbyCode}")]
async fn get_leaderboard(lobby_code: web::Path<String>) -> impl Responder {
    let lobby_code = lobby_code.into_inner();
    
    match get_leaderboard_from_db(lobby_code).await {
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
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

       App::new()
            .wrap(cors)
            .service(get_leaderboard)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
