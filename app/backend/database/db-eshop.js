// use eshop;
db.createCollection("roles");
db.createCollection("permissiontypes");
db.createCollection("users");
db.createCollection("addresses");
db.createCollection("creditcards");
db.createCollection("categories");
db.createCollection("products");
db.createCollection("orders");
db.createCollection("storesettings");

let result;
let s3URL = 'myawsbucket.amazonaws.com'

db.storesettings.insertOne({
    name: "e shop",
    logo_url: "https://duet-cdn.vox-cdn.com/thumbor/0x0:1280x720/828x552/filters:focal(575x391:576x392):format(webp)/cdn2.vox-cdn.com/uploads/chorus_asset/file/9356429/maxresdefault.jpg",
    nit: "123456789",
    phone_number: "555-1234",
    address: "C. Rodolfo Robles 29-99, Quetzaltenango, Quetzaltenango"
  });
  
result = db.categories.insertMany([
    { name: "Tecnología" },
    { name: "Hogar" },
    { name: "Oficina" },
    { name: "Libros" },
    { name: "Decoración" },
    { name: "Juguetes" },
    { name: "Electrónica" },
    { name: "Belleza" },
]);
const categories = Object.values(result.insertedIds);

result = db.roles.insertMany([
    { code: 1001, name: "ADMIN" },
    { code: 1002, name: "ASSISTANT" },
    { code: 2000, name: "CUSTOMER" }
  ]);  

const RoleIds = Object.values(result.insertedIds);

result = db.permissiontypes.insertMany([
    {
        name: "Pedido",
        available_actions: ["create", "edit", "view"]  // Solo las acciones permitidas
    },
    {
        name: "Producto",
        available_actions: ["create", "edit", "delete", "view"]
    },
    {
        name: "Configuracion",
        available_actions: ["edit", "view"]
    },
    {
        name: "Usuario",
        available_actions: ["create", "edit", "delete", "view"]
    },
    {
        name: "Reportes",
        available_actions: ["create", "view"]
    },
    {
      name: "Categoria",
      available_actions: ["create", "edit", "delete", "view"]
  }
]);
  
const permissionTypeIds = Object.values(result.insertedIds);

const password_users = '$2b$10$pMRoCUy30/tOGklvXXwN3.gVeZQ.h9oF1QvCGoFhYJyAqGactqExq' //12345

result = db.users.insertMany([
    {
      name: "Admin",
      lastname: "User",
      email: "admin@eshop.com",
      password: password_users,
      role: RoleIds[0] // ADMIN
    },
    {
      name: "Ayudante",
      lastname: "User1",
      email: "assistant1@eshop.com",
      password: password_users,
      role: RoleIds[1], // ayudante
      permissions: [
        { permissionType: permissionTypeIds[0], actions: ["edit", "view"] },
        { permissionType: permissionTypeIds[1], actions: ["create", "delete"] },
        { permissionType: permissionTypeIds[2], actions: ["view"] }
      ]
    },
    {
      name: "Ayudante",
      lastname: "User2",
      email: "assistant2@eshop.com",
      password: password_users,
      role: RoleIds[1], // ayudante
      permissions: [
        { permissionType: permissionTypeIds[0], actions: ["view"] }, 
        { permissionType: permissionTypeIds[3], actions: ["edit"] },
        { permissionType: permissionTypeIds[4], actions: ["create", "view"] }
      ]
    },
    {
        name: "Cliente",
        lastname: "Fiel",
        email: "cliente@eshop.com",
        password: password_users,
        role: RoleIds[2] //CLIENTE
      }
  ]);
