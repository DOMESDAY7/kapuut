FROM golang:1.23.4 as build

WORKDIR /go/src/app
COPY . .

RUN go mod download
RUN go vet -v cmd/main.go
RUN go test -v cmd/main.go

RUN CGO_ENABLED=0 go build -o /go/bin/app cmd/main.go
EXPOSE 3100
FROM gcr.io/distroless/static-debian12

COPY --from=build /go/bin/app /
CMD ["/app"]