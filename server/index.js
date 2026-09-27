const CORS = require("cors");
const User = require("./models/User");
const Task = require("./models/Task");
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose");
const port = 3000;
const xlsx = require('xlsx');
const csv = require('csv-parser');
/* @author 🆉. Sūn 2026 */
const session = require("express-session");
const cookieParser = require("cookie-parser");

const corsOptions = {
    origin: '*',
    credentials: true,
};
app.use(CORS(corsOptions));

app.use(cookieParser());
app.use(
    session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: true,
        cookie: {secure: true}, 
    })
);

mongoose
    .connect("mongodb://localhost/testDataBase", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB...")) 
    .catch((err) => console.error("Could not connect to MongoDB...", err)); 

const calcMD5 = (data) => {
    return crypto.createHash("md5").update(data).digest("hex");
};

const saveImage = (data, fileName) => {
    const outputDirectory = path.resolve(__dirname, "./output");
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory);
    }
    const fileOutputPath = path.resolve(outputDirectory, fileName);
    if (fs.existsSync(fileOutputPath)) {
        console.log(`File ${fileName} already exists`);
        return;
    }
    fs.writeFileSync(fileOutputPath, data);
};

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const createErrorResponse = (message) => {
    return JSON.stringify({
        success: false,
        message,
    });
};

app.post("/uploadImage", async (req, res) => {
    const {url} = req.body;

    res.setHeader("content-type", "application/json");

    if (!url) {
        res.status(400).send(createErrorResponse("URL is required"));
        return;
    }
    try {
        const parseUrl = new URL(url);
    } catch (e) {
        res.status(400).send(createErrorResponse("Invalid URL"));
        return;
    }

    try {
        const image = await axios.get(url, {
            responseType: "arraybuffer",
        });
        const md5 = calcMD5(image.data);
        const ext = url.split("?")[0].split(".").pop();
        const fileName = `${md5}.${ext}`;
        console.log(`Saving image to ./output/${fileName}`);
        saveImage(image.data, fileName);

        res.send(
            JSON.stringify({
                success: true,
                data: {
                    md5,
                    fileName,
                },
            })
        );
    } catch (e) {
        res
            .status(500)
            .send(createErrorResponse(`Can not download image from ${url}`));
    }
});
/* @author Z. Sūn 2026 */
app.get("/menus", async (req, res) => {
    try {
        const menus = [
            {
                id: 1,
                authName: 'home',
                path: '/home',
                children: [
                    {
                        id: 11,
                        authName: 'home overview',
                        path: '/home/home',
                    },
                ]
            },
            {
                id: 2,
                authName: 'user',
                path: '/home/user',
                children: [
                    {
                        id: 21,
                        authName: 'user management',
                        path: '/home/user',
                    }
                ]
            },
            {
                id: 3,
                authName: 'task',
                path: '/home/task',
                children: [
                    {
                        id: 31,
                        authName: 'task details',
                        path: '/home/task',
                    }
                ]
            }
        ];
        res.status(200).json({meta: {status: 200, msg: 'Get the menu list successfully'}, data: menus});
    } catch (error) {
        res.status(500).send({meta: {status: 500, msg: 'Failed to get the menu list'}, error: error});
    }
});

const PeopleSchema = new mongoose.Schema({
    username: String,
    email: String,
    mobile: String,
    role_name: String,
});
const People = mongoose.model('People', PeopleSchema);

app.get("/people", async (req, res) => {
    const pagenum = parseInt(req.query.pagenum, 10) || 1;
    const pagesize = parseInt(req.query.pagesize, 10) || 10; 

    try {
        const total = await People.countDocuments();
        const users = await People.find()
            .skip((pagenum - 1) * pagesize) 
            .limit(pagesize); 

        res.json({
            meta: {
                status: 200,
                msg: 'Successfully obtained the personnel list!',
            },
            data: {
                total: total,
                users: users,
                pagenum: pagenum,
                pagesize: pagesize
            }
        });
    } catch (error) {
        console.error("Failed to obtain personnel list:", error);
        res.status(500).json({meta: {status: 500, msg: "Failed to obtain personnel list"}, error: error});
    }
});
/* @author 2h-5 */
app.post("/people", async (req, res) => {
    try {
        const newPerson = new People(req.body);
        await newPerson.save();
        res.status(201).json({meta: {status: 201, msg: "Added person successfully"}, data: newPerson});
    } catch (error) {
        console.error("Failed to add person:", error);
        res.status(500).json({meta: {status: 500, msg: "Failed to add person..."}, error: error});
    }
});

app.post("/register", async (req, res) => {
    console.log("Received request body:", req.body);
    try {
        let {username, password, nickname, userType, roleType} = req.body;
        username = String(username);
        password = String(password);
        nickname = String(nickname);
        userType = String(userType);
        roleType = String(roleType);
        console.log(
            `The registered account password obtained by the backend ${
                req.body
            } Username ${username} ${typeof username}  Password ${password} ${typeof password}`
        );

        const workBook = xlsx.readFile('./data/userinfo.xlsx')
        let name = workBook.SheetNames[0]
        let sheet = workBook.Sheets[name]
        const jsonData = xlsx.utils.sheet_to_json(sheet)
        let user = null;
        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i].username == username) {
                user = jsonData[i]
            }
        }

        if (user != null) {
            res.status(201).send({success: false, message: "User already exists"});
        } else {
            xlsx.utils.sheet_add_aoa(sheet, [
                [jsonData.length + 1, username, password, nickname, roleType, userType, 'activated']
            ], {origin: -1});
            xlsx.writeFile(workBook, './data/userinfo.xlsx');

            res.status(201).send({success: true, message: "User registration successful!"});
        }
    } catch (error) {
        console.error("Registration Error:", error); 
        res.status(500).send({success: false, message: "User registration failed" + error});
    }
});

app.post("/submitUser", async (req, res) => {
    console.log("Received request body:", req.body);
    try {
        let {p, p1, p2, type} = req.body;
        p = String(p);
        p1 = String(p1);
        p2 = String(p2);
        type = String(type);

        const workBook = xlsx.readFile('./data/userinfo.xlsx')
        let name = workBook.SheetNames[0]
        let sheet = workBook.Sheets[name]
        const jsonData = xlsx.utils.sheet_to_json(sheet)
        let user = null;
        for (let i = 0; i < jsonData.length; i++) {
            if (type == 1 && jsonData[i].id == p) {
                user = jsonData[i]
                break
            } else if (type == 2 && jsonData[i].id == p1) {
                user = jsonData[i]
                break
            } else if (type == 3 && jsonData[i].id == p2) {
                user = jsonData[i]
                break
            }
        }
/* 🆉. */
        if (user != null) {
            if (type == 1) {
                sheet['E' + (user.id + 1)].v = 'admin'
            } else if (type == 2) {
                sheet['G' + (user.id + 1)].v = 'deactivated'
            } else if (type == 3) {
                sheet['G' + (user.id + 1)].v = 'activated'
            }

            xlsx.writeFile(workBook, './data/userinfo.xlsx');
            res.status(200).send({success: true, message: "Modification successful"});
        } else {
            res.status(500).send({success: false, message: "User information search failed" + error});
        }
    } catch (error) {
        console.error("Registration Error:", error); 
        res.status(500).send({success: false, message: "User registration failed" + error});
    }
});

app.post("/login", async (req, res) => {
    let {username, password} = req.body;
    username = String(username);
    password = String(password);
    console.log(
        `The login account and password obtained by the backend ${
            req.body
        } Username ${username} ${typeof username}  Password ${password} ${typeof password}`
    );


    const workBook = xlsx.readFile('./data/userinfo.xlsx')
    let name = workBook.SheetNames[0]
    let sheet = workBook.Sheets[name]
    const jsonData = xlsx.utils.sheet_to_json(sheet)
    console.log(jsonData);

    let user = null;
    for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].username == username) {
            user = jsonData[i]
        }
    }
    if (!user) {
        return res.status(401).send("Username does not exist!");
    }
    console.log(
        `This corresponds to the correct account password Username ${user.username} Password ${
            user.password
        } `
    );
    let isMatch = false;

    if (user.password == password) {
        isMatch = true;
    }

    if (!isMatch) {
        return res.status(401).send("Incorrect username or password!");
    }

    if ("deactivated" === user.UserStatus) {
        res.json({
            success: true,
            message: "user deactivated",
            meta: {
                status: 204
            }
        });
    } else {
        const token = "generated-token-for-demo";

        req.session.userId = user.id;
        res.cookie('token', token, {httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 3600000});
        res.json({
            success: true,
            message: "Login successful",
            token: token, 
            meta: {
                status: 200,
                id: user.id, 
                username: user.username,
                role: user.role,
                nickname: user.nickname
            }
        });
    }
});
/* 🆉. Sun 2026 */
app.post("/updatePwd", async (req, res) => {
    let {id, opassword, password} = req.body;
    id = String(id);
    password = String(password);
    opassword = String(opassword);

    const workBook = xlsx.readFile('./data/userinfo.xlsx')
    let name = workBook.SheetNames[0]
    let sheet = workBook.Sheets[name]
    const jsonData = xlsx.utils.sheet_to_json(sheet)
    console.log(jsonData);

    let user = null;
    for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].id == id) {
            user = jsonData[i]
            break
        }
    }
    if (!user) {
        return res.status(401).send("Username does not exist...");
    }
    console.log(
        `This corresponds to the correct account password Username ${user.username} Password ${
            user.password
        } `
    );

    let isMatch = false;

    if (user.password == opassword) {
        isMatch = true;
    }

    if (!isMatch) {
        res.status(401).send("Original password does not match!");
    } else {
        if (user != null) {
            sheet['C' + (user.id + 1)].v = password
            xlsx.writeFile(workBook, './data/userinfo.xlsx');
            res.status(200).send({success: true, message: "Password has been updated successfully!"});
        } else {
            res.status(500).send({success: false, message: "Original password does not match!"});
        }
    }
});

app.post('/getUser', async (req, res) => {
    try {
        const workBook = xlsx.readFile('./data/userinfo.xlsx')
        let name = workBook.SheetNames[0]
        let sheet = workBook.Sheets[name]
        const jsonData = xlsx.utils.sheet_to_json(sheet)
        console.log(jsonData);
        let {type} = req.body;
        type = String(type);

        let users = [];
        let num = 0;
        for (let i = 0; i < jsonData.length; i++) {
            if (type == 1) {
                if (jsonData[i].role == 'user' && 'undefined' != jsonData[i].username && null != jsonData[i].username && jsonData[i].username.length > 0) {
                    users[num++] = jsonData[i]
                }
            } else if (type == 2) {
                if (jsonData[i].UserStatus == 'activated' && 'undefined' != jsonData[i].username && null != jsonData[i].username && jsonData[i].username.length > 0) {
                    users[num++] = jsonData[i]
                }
            } else if (type == 3) {
                if (jsonData[i].UserStatus == 'deactivated' && 'undefined' != jsonData[i].username && null != jsonData[i].username && jsonData[i].username.length > 0) {
                    users[num++] = jsonData[i]
                }
            }
        }
        res.json({
            meta: {
                status: 200,
                msg: 'Successfully obtained the task list!'
            },
            data: {
                users: users
            }
        });
    } catch (error) {
        console.error("Failed to get the task list:", error);
        res.status(500).json({meta: {status: 500, msg: "Failed to get the task list."}});
    }
});
/* @author Sūn 2026 */
app.get('/getAreas', async (req, res) => {
    try {
        const workBook = xlsx.readFile('./data/areaSelect.xlsx')
        let name = workBook.SheetNames[0]
        let sheet = workBook.Sheets[name]
        const jsonData = xlsx.utils.sheet_to_json(sheet)

        const provincesData = jsonData.slice(1).reduce((acc, row) => {
            const province = row[0];
            const cities = row[1];
            const districts = row[2];
            acc[province] = {cities: cities ? cities.split(' ') : [], districts: districts ? districts.split(' ') : []};
            return acc;
        }, {});


        res.json({
            meta: {
                status: 200,
                msg: 'Successfully obtained the task list!'
            },
            data: {
                tasks: tasks,
                total: total
            }
        });
    } catch (error) {
        console.error("Failed to get the task list:", error);
        res.status(500).json({meta: {status: 500, msg: "Failed to get the task list."}, error: error});
    }
});


let destinations = [];
let lists = {};
let destinationsT = [];

const csvPath = path.join(__dirname, 'data', 'europe-destinations.csv');
fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (row) => {
        if (destinations.length === 0) {
            console.log('First row of CSV:', row); 
        }
        row.flag = 'Private'
        destinations.push(row);
        destinationsT.push(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed!');
    });

function sanitizeInput(input) {
    if (undefined == input) {
        return "";
    }
    return input.replace(/[&<>"']/g, (match) => {
        const escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escape[match];
    });
}

app.get('/api/destination/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id >= 0 && id < destinations.length) {
        res.json(destinations[id]);
    } else {
        res.status(404).json({error: 'Destination not found...'});
    }
});

app.get('/api/coordinates/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id >= 0 && id < destinations.length) {
        const {Latitude, Longitude} = destinations[id];
        res.json({Latitude, Longitude});
    } else {
        res.status(404).json({error: 'Destination not found...'});
    }
});

app.get('/api/countries', (req, res) => {
    const countries = [...new Set(destinations.map(dest => dest.Country))];
    res.json(countries);
});
/* github.com/2h-5 */
app.get('/api/search', async (req, res) => {
    const {field, pattern, n} = req.query;
    const sanitizedPattern = sanitizeInput(pattern);
    const limit = n ? parseInt(n) : destinations.length;

    const matches = destinations
        .map((dest, index) => ({...dest, id: index}))
        .filter(dest =>
            dest[field] && dest[field].toLowerCase().startsWith(sanitizedPattern.toLowerCase()))
        .slice(0, limit);

    if (matches.length > 0) {
        res.json(matches);
    } else {
        res.status(404).json({error: 'No matches found...'});
    }
});

app.get('/api/searchNotAdmin', async (req, res) => {
    const {field, pattern, n} = req.query;
    const sanitizedPattern = sanitizeInput(pattern);
    const limit = n ? parseInt(n) : destinations.length;

    const matches = destinations
        .map((dest, index) => ({...dest, id: index}))
        .filter(dest =>
            dest[field] && dest[field].toLowerCase().startsWith(sanitizedPattern.toLowerCase()) && dest['flag'] == "Public")
        .slice(0, limit);

    if (matches.length > 0) {
        res.json(matches);
    } else {
        res.status(404).json({error: 'No matches found...'});
    }
});

app.post('/api/lists', (req, res) => {
    const {name} = req.body;
    const sanitizedName = sanitizeInput(name);

    if (lists[sanitizedName]) {
        res.status(400).json({error: 'List already exists!'});
    } else {
        lists[sanitizedName] = [];
        res.json({message: 'List created successfully!'});
    }
});

app.put('/api/lists/:name', (req, res) => {
    const {name} = req.params;
    const {destinations} = req.body;
    const sanitizedName = sanitizeInput(name);

    if (lists[sanitizedName]) {
        lists[sanitizedName] = destinations;
        res.json({message: 'List updated successfully!'});
    } else {
        res.status(404).json({error: 'List not found...'});
    }
});

app.get('/api/lists/:name', (req, res) => {
    const {name} = req.params;
    const sanitizedName = sanitizeInput(name);

    if (lists[sanitizedName]) {
        res.json(lists[sanitizedName]);
    } else {
        res.status(404).json({error: 'List not found...'});
    }
});

app.delete('/api/lists/:name', (req, res) => {
    const {name} = req.params;
    const sanitizedName = sanitizeInput(name);

    if (lists[sanitizedName]) {
        delete lists[sanitizedName];
        res.json({message: 'List deleted successfully!'});
    } else {
        res.status(404).json({error: 'List not found...'});
    }
});

app.get('/api/flagList/:name/:flag', (req, res) => {
    const {name, flag} = req.params;
    const sanitizedName = sanitizeInput(name);

    if (lists[sanitizedName]) {
        let ll = lists[sanitizedName]
        for (let i = 0; i < ll.length; i++) {
            destinations[ll[i]].flag = flag
        }
        res.json({message: 'List flagged successfully!'});
    } else {
        res.status(404).json({error: 'List not found...'});
    }
});
/* @author 🆉. Sūn 2026 */
app.get('/api/lists/:name/details', (req, res) => {
    const {name} = req.params;
    const sanitizedName = sanitizeInput(name);

    if (lists[sanitizedName]) {
        const details = lists[sanitizedName].map(id => {
            const dest = destinations[id];
            return {
                destination: dest.Destination,
                region: dest.Region,
                country: dest.Country,
                coordinates: {lat: dest.Latitude, lng: dest.Longitude},
                currency: dest.Currency,
                language: dest.Language,
                flag: dest.flag
            };
        });
        res.json(details);
    } else {
        res.status(404).json({error: 'List not found...'});
    }
});

app.get('/api/lists', (req, res) => {
    res.json(Object.keys(lists));
});

app.get('/api/cities', async (req, res) => {
    const {field, pattern, n} = req.query;
    let fieldt = field
    let patternt = pattern
    let nt = n
    if (undefined == field) {
        fieldt = "Destination"
    }

    if (undefined == n) {
        nt = 5
    }

    if (undefined == pattern) {
        patternt = ""
    }

    const sanitizedPattern = sanitizeInput(patternt);
    const limit = nt ? parseInt(nt) : destinations.length;

    const matches = destinations
        .map((dest, index) => ({...dest, id: index}))
        .filter(dest =>
            dest[fieldt] && dest[fieldt].toLowerCase().startsWith(sanitizedPattern.toLowerCase()) && dest['flag'] == "Public")
        .slice(0, limit);

    if (matches.length > 0) {
        const details = matches.map(obj => {
            const dest = destinations[obj.id];
            if (undefined != dest) {
                return {
                    cityName: dest.Destination,
                    country: dest.Country,
                    region: dest.Region,
                    position: {lat: dest.Latitude, lng: dest.Longitude},
                    rate: dest.rate,
                    language: dest.Language,
                    id: obj.id,
                    date: dest.date
                };
            }
        }).filter(dest =>
            undefined != dest);
        if (details.length > 0) {
            res.json(details);
        } else {
            res.status(404).json([]);
        }
    } else {
        res.status(404).json([]);
    }
});

app.post('/api/cities', async (req, res) => {
    const {id, notes, rate, date} = req.body;
    if (undefined != id) {
        destinations[id].date = date
        destinations[id].rate = rate
        res.json(
            {
                cityName: destinations[id].Destination,
                country: destinations[id].Country,
                region: destinations[id].Region,
                position: {lat: destinations[id].Latitude, lng: destinations[id].Longitude},
                rate: destinations[id].rate,
                language: destinations[id].Language,
                id: id,
                date: destinations[id].date
            }
        );
    } else {
        res.status(404).json([]);
    }
});
/* @author 🆉. Sūn 2026 */
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
