import app from "./app.js";
import http from "http";
import { connectToDB } from "../domain/db/index.js";

const port = process.env.PORT;
const server = http.createServer(app);

connectToDB().then(() => {
	server.listen(port, ()=>{
        console.log(`Server is listening on the port ${port}`);
    })
});
