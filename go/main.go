package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"strconv"
	"time"
)

func handleRequests() {
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/hello/{name}", helloHandler)

	log.Fatal(http.ListenAndServe(":8080", myRouter))
}

func main() {
	handleRequests()
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

	_, _ = fmt.Fprintf(w, "Hello "+key)
}
