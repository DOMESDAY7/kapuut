FROM rust:1 as build-env
WORKDIR /app
COPY . /app
RUN cargo build --release

FROM gcr.io/distroless/cc-debian12
EXPOSE 8080
COPY --from=build-env /app/target/release/quiz-leaderboard /
CMD ["./quiz-leaderboard"]
