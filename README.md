Before starting the program, fill in the .env file!<br>
Function signin: takes id and password data from the token.<br>
POST http://localhost/signin<br>
Function signup: checks if the user is logged in. Writes the data of the new user to DB and creates a token.<br>
POST http://localhost/signup<br>
Function userInfo: returns data in the format JSON about the user who is currently logged in.<br>
GET http://localhost/info<br>
Function tokenTimeExtension: issues a new token with an extended time to the user in case of access to functions userInfo and latency.<br>
Function latency: returns the delay time when accessing the site google.com.<br>
GET http://localhost/latency<br>
Function logout: resets the user's current token.<br>
GET http://localhost/logout/true
<br>
An example of a sent object:<br>
POST<br>
{<br>
    "user_id": "john@gmail.com",<br>
    "id_type": "email",<br>
    "password" : "123456"<br>
}<br>
