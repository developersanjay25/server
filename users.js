const users = [];

const adduser = ({ id, name, room , handrise,emailOrphone , profile}) => {
    const existingUser = users.find((user) => user.room === room && user.name === name);

    if(!name || !room) return { error: 'Username and room are required.' };
    // if(existingUser) return { error: 'Username is taken.' };

    const user = { id, name, room , handrise, emailOrphone , profile};

    users.push(user);
    console.log("printing user array " +{ user })
    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    console.log("user removed",index )    
    if(index !== -1) {
    return users.splice(index, 1)[0];
    }
    else{
        return false;
    }
}

const getUser = (id) => 
{
    console.log('users',users)
    return users.find((user) => user.id === id);
}


const getUserbymail = (id,handrise) => 
{
    console.log(id);
    const rise = users.find((user) => user.emailOrphone === id);

    const risemem = users.indexOf(rise);
    users[risemem].handrise = handrise;
    console.log('updated',users[risemem]);
}


const permissiontousers = (id,permission) => 
{
    console.log(id,permission);
    const rise = users.find((user) => user.emailOrphone === id);

    const risemem = users.indexOf(rise);
    console.log('updated',users[risemem]);
    users[risemem].permission = permission;
    console.log('updated',users[risemem]);
    return rise.id;
}


const togglepermission = (id,audio,video) => 
{
    const rise = users.find((user) => user.emailOrphone === id);

    const risemem = users.indexOf(rise);

    users[risemem].audio = audio;
    users[risemem].video = video;
}


const updaterole = (id,role) => 
{
    const rise = users.find((user) => user.emailOrphone === id);

    const risemem = users.indexOf(rise);

    users[risemem].role = role;
    
    console.log('updated',users[risemem]);
}

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { adduser, removeUser, getUser, getUsersInRoom, getUserbymail, permissiontousers , togglepermission,updaterole};