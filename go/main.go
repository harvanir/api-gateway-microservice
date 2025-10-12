package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gorilla/mux"
)

func handleRequests() {
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/hello/{name}", helloHandler)

	log.Fatal(http.ListenAndServe(":8080", myRouter))
}

func main() {
	server := os.Getenv("SERVER")

	if server == "fiber" {
		setupFiber()
	} else {
		handleRequests()
	}
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["name"]
	delayParArr, ok := r.URL.Query()["delay"]

	if ok && len(delayParArr[0]) > 0 {
		delay, err := strconv.Atoi(delayParArr[0])

		if err == nil && delay > 0 {
			time.Sleep(time.Duration(delay) * time.Millisecond)
		}
	}

	_, _ = fmt.Fprintf(w, "%s", "Hello "+key)
}

func setupFiber() {
	app := fiber.New()

	app.Get("/hello/:"+P_NAME, handleName)
	// Start the server on port 8081
	log.Fatal(app.Listen(":8081"))
}

const P_NAME = "name"

func handleName(c *fiber.Ctx) error {
	name := c.Params(P_NAME)
	delayPar := c.Query("delay")

	if delayPar != "" {
		delay, err := strconv.Atoi(delayPar)

		if err == nil && delay > 0 {
			time.Sleep(time.Duration(delay) * time.Millisecond)
		}
	}

	return c.SendString("Hello " + name)
}
