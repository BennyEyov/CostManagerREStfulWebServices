require('dotenv').config();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  await mongoose.connection.collection('users').deleteMany({ id: 8888 });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('API Routes', () => {
  it('GET /api/about should return team members', async () => {
    const res = await request(app).get('/api/about');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /api/add', ()=>{
    it('should create a new cost item and return it', async ()=>{
        const newCost = {
            userid: 123123,
            description: 'Hamburger',
            category: 'food',
            sum: 12.5,
            date: '2025-06-05'
        };

        const res = await request(app)
            .post('/api/add')
            .send(newCost)
            .set('Accept','application/json');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.description).toBe(newCost.description);
        expect(res.body.userid).toBe(newCost.userid);
        expect(res.body.category).toBe(newCost.category);
        expect(res.body.sum).toBe(newCost.sum);
    });

    it('should fail with code 500 if required fields are missing', async ()=>{
        const badCost = {
            userid: 123123,
            description: 'Missing category and sum'
        };

        const res = await request(app)
            .post('/api/add')
            .send(badCost)
            .set('Accept','application/json');

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('GET /api/report', ()=>{
    it('should return costs grouped by category for specified user/month/year', async ()=>{
        const userId = 123123;
        const year = 2025;
        const month = 6;

        const res = await request(app)
            .get('/api/report')
            .query({id:userId, year, month});

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('userid', userId.toString() || userId);
        expect(res.body).toHaveProperty('year',year);
        expect(res.body).toHaveProperty('month',month);
        expect(Array.isArray(res.body.costs)).toBe(true);
    });

    it('should fail with 400 if query parameters missing', async ()=>{
        const res = await request(app).get('/api/report');
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});

describe('POST /api/users', ()=>{
    it('should create a new user and return it', async ()=>{
        const newUser = {
            id: 8888,
            first_name: 'Alice',
            last_name: 'Johnson',
            birthday: '1990-05-20',
            marital_status: 'single'
        };

        const res = await request(app)
            .post('/api/users')
            .send(newUser)
            .set('Accept','application/json');

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id', newUser.id);
        expect(res.body).toHaveProperty('first_name', newUser.first_name);
        expect(res.body).toHaveProperty('last_name', newUser.last_name);
        expect(res.body).toHaveProperty('birthday');
        expect(res.body.birthday.startsWith('1990-05-20')).toBe(true);
        expect(res.body).toHaveProperty('marital_status', newUser.marital_status);
    });

    it('should fail if required fields are missing', async ()=>{
        const badUser = {id:8888};
        const res = await request(app)
            .post('/api/users')
            .send(badUser)
            .set('Accept','application/json');

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});

describe('GET /api/users/:id', ()=>{
    const testUser = {
        id:9999,
        first_name: 'Test',
        last_name: 'User',
        birthday: '1990-01-01',
        marital_status: 'single'
    };

    const testCosts = [
        {
            userid: 9999,
            description: 'Test Item 1',
            category: 'food',
            sum: 10,
            date: '2025-06-01'
        },
        {
            userid: 9999,
            description: 'Test Item 2',
            category: 'food',
            sum: 15,
            date: '2025-06-02'
        }
    ];

    beforeAll( async () =>{
        await mongoose.connection.collection('users').deleteMany({ id: 9999 });
        await mongoose.connection.collection('costs').deleteMany({ userid: 9999 });

        await request(app).post('/api/users').send(testUser);
        for(const cost of testCosts){
            await request(app).post('/api/add').send(cost);
        }
    });

    afterAll( async () => {
        await mongoose.connection.collection('users').deleteMany({id:9999});
        await mongoose.connection.collection('costs').deleteMany({id:9999});
    });

    it('should return user with total cost', async ()=>{
        const res = await request(app).get('/api/users/9999');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', 9999);
        expect(res.body).toHaveProperty('first_name', testUser.first_name);
        expect(res.body).toHaveProperty('last_name', testUser.last_name);
        expect(res.body).toHaveProperty('total', 25);
    });

    it('should return 404 for non-existent user', async () => {
        const res = await request(app).get('/api/users/123456789');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'User not found');
    });
});