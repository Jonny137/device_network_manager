## Device Network Manager
<img src="https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/267_Python-512.png"
     alt="Markdown Python icon"
     height="40px"
/>&nbsp;&nbsp;
<img src="https://cdn.onlinewebfonts.com/svg/img_437027.png"
     alt="Markdown Flask icon"
     height="40px"
/>&nbsp;&nbsp;
<img src="https://www.iconninja.com/files/332/243/605/react-js-react-logo-js-icon.png"
     alt="Markdown React icon"
     height="45px"
/>&nbsp;&nbsp;
<img src="https://g.foolcdn.com/art/companylogos/mark/MDB.png"
     alt="Markdown Mongo icon"
     height="40px"
/>


Application for listing and managing remote devices. It consists of a backend server written in `Flask` and frontend created using `React`. The database is `MongoDB`. Everything was made under `WindowsOS` and using `Powershell` as command line interface.

There are options to **add**, **delete** and **edit** devices. All the devices listed in the table are being periodically pinged and their connection status is written in the STATUS column.

Statistics like **number of disconnected devices** and **most diconnected device** with it's *name*, *IP address* and *time disconnected* are shown in the header.

The application was deployed on **Heroku** but, due to restrictions of only two dynos for free use, the application has a *Procfile* that can be used for hosting.

### Getting Started

It is necessary to indenpendently run backend server and frontend.

### Running Flask (Backend Part)

It is recommended to run Flask in a virtual environment. Navigate into `flask_app` folder, open powershell and run following command:

`env\Scripts\activate`

Afterwards install requirements wih command:

`pip install -r requirements.txt`

The next step is to create your own **MongoDB** cluster and generate a URL. Everything regarding this step can be found on 

https://www.mongodb.com/

After you have generated a URL, create a file named ***mongo_db.py*** inside the flask_app folder and in that file assign that URL to a variable called ***MONGO_DB_URL***.

With that, your linking between backend and database is done.

Since there is a `.flaskenv` config file to start the server, you can simply run the following command in your CLI:

`flask run`

**Notice:** It is recommended to install the **MongoDBCompass** application on your PC for easy preview, testing and modification of both your local databases and the ones which are on your cluster.

### Running React (Frontend Part)

To start the frontend part of the application, you need to run the following command inside the root folder (a step backwards if you're in `flask_app` folder):

`npm start`
