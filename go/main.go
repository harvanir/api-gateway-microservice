package main

import (
    "fmt"
    "log"
    "net/http"
    "github.com/gorilla/mux"
    "time"
    "strconv"
//     "math/rand"
)

func handleRequests() {
    myRouter := mux.NewRouter().StrictSlash(true)
    myRouter.HandleFunc("/hello/{name}", helloHandler)
    log.Fatal(http.ListenAndServe(":8080", myRouter))
}

func main() {
    handleRequests()
}

func helloHandler(w http.ResponseWriter, r *http.Request){
    vars := mux.Vars(r)
    key := vars["name"]
    delay, err := strconv.Atoi(r.URL.Query().Get("delay"))

    if (err == nil && delay > 0) {
        time.Sleep(time.Duration(delay) * time.Millisecond)
    }

    fmt.Fprintf(w, "Hello " + key)
}