# EuroTime (Prototype #2️⃣)

## Descriptions 📋

**EuroTime** is a **mapping application** that can let users to **access detailed information** about travel destinations **in Europe**, users can also **create collections and ratings** for their **favourite destinations**.

This is the `second` prototype *(and tentatively the final version)* of **EuroTime**.

On top of Prototype #1️⃣, I further developed **more functionalities** for both frontend and backend, which includes [**React**](https://react.dev/) for **frontend framework**, [**MongoDB**](https://www.mongodb.com/) for **storing user information**, [**AntD**](https://ant.design/) for **input validation**, and more!

## Features ⚙

###### All the features in Prototype #1️⃣ still exist, but the below features are new for Prototype #2️⃣:

1. A **homepage** to introduce EuroTime to new users, **including navigation bar** on the top and sample policies on the bottom.
2. **Login/register pages** for new users to get access to EuroTime, **updating password** is possible to choose in map page.
3. A **separate page** for **searching** users' **favourite destinations** and **rating them**. (But users have to create a list and flag them to be public first!)
4. Users can choose to **search** their **favourite destinations by [**Google**](https://www.google.com/)** instead of reading fetched details from the database.
5. Users can try **admin roles** and access **admin's site manager** in order to **activate/deactivate** their personal account. (Admin account info is stored in `server/data/userinfo.xlsx`)

## Installation 📥

###### Unfortunately, GitHub Pages does not support web deployment for backend, so I cannot deploy this application online `(at no cost)`. Thus, if you want to try and test out my work, you have to follow the steps I provided below carefully...

**1.** **Download the zip file** (`<> Code → Download ZIP`) to the location you wish and **unzip** it (`depends on what compression software you use`).

**2.** **Open 2 terminals**, **one in** the **`server` folder**, the **other one in** the **`client` folder**.

> *If you do not know how to open terminals to specific folders*, you can **open 2 terminals in desktop**, then run these commands to **navigate each terminal**:
> 
> Navigate to the `server` folder: 
> ```
> cd **location-you-store-the-app-folder**/eurotime/server
> ```
> Navigate to the `client` folder: 
> ```
> cd **location-you-store-the-app-folder**/eurotime/client
> ```

**3.** Run the following command to **install** the **required dependencies** on both **client** and **server terminal**. (You have to install NPM first following this [guideline](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).)
```
npm install
```
> It may takes few more minutes to download all dependencies for frontend than the backend, please be patient!

**4.** After the installation is finished, **run the backend** in the **server terminal** using this command:
```
npm run start
```
> *If nothing is going wrong, the server terminal will display these outputs:*
> 
> <img src="client/public/screenshot2k.png" width="360" />
> 
> Then, **go to [localhost:3000](http:localhost:3000)** on your browser. *If you see "Hello World!" on the browser, this means your backend is running successfully!*


5. After the backend runs successfully, **run the frontend** in the **client terminal** using this command:
```
npm run dev
```
> *If nothing is going wrong, the client terminal will display these outputs:*
> 
> <img src="client/public/screenshot2l.png" width="360" />
> 
> Then, **go to [localhost:5173](http:localhost:5173)** on your browser. *If you can see the homepage of EuroTime, this means your frontend is also running successfully, so you can **finally** try and test out this app on your own computer!*

6. Once you finished playing this app, you have to **go back to both client** and **server terminal**, and **press `Ctrl + C`** in order to close both the frontend and backend.

7. Repeat **Step 2**, **Step 4 ~ 6** for the next time you want to try this app.

## Stories Behind the Work 📠

The early version of this prototype was my final project from one of my university courses —— Web Technologies.

The course taught theoretical contents about how to build full stack applications. This project is to *apply the theoratical knowledge to make a real application*, both the **client-side** and **server-side scripting** was self-learned and developed.

Compared to the early version, what I have **further developed** for this version are:

1. **Enhance** the **visual effects** of the frontend to be more intuitive.
2. Add different pop-up messages to **handle different scenarios**.
3. **Apply password encryption** for the backend in case of security.

## Screenshots 📸

### Homepage

<img src="client/public/screenshot2a.png" width="720" />

### Login/Register

<img src="client/public/screenshot2b.png" width="720" />

<img src="client/public/screenshot2c.png" width="720" />

### Listing & Flagging

<img src="client/public/screenshot2d.png" width="720" />

<img src="client/public/screenshot2e.png" width="720" />

### Searching & Rating

<img src="client/public/screenshot2g.png" width="720" />

<img src="client/public/screenshot2f.png" width="720" />

<img src="client/public/screenshot2h.png" width="720" />

<img src="client/public/screenshot2i.png" width="720" />

### Admin Privileges

<img src="client/public/screenshot2j.png" width="720" />
