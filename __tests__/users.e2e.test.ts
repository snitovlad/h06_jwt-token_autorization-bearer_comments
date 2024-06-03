import { clearTestDb, closeTestDb, connectToTestDb, createNewEntity, createNewUser1, createNewUser2 } from "./mongo-datasets"
import { req } from './test-helpers';
import { SETTINGS } from '../src/settings'
import { CreateUserModel } from "../src/models/users-model/CreateUseerModel";
import { ObjectId } from "mongodb";

describe('/users', () => {

    beforeAll(async () => {
        await connectToTestDb()
        // await req.delete('/testing/all-data')

    })
    beforeEach(async () => {
        await clearTestDb()
    })
    afterAll(async () => {
        await closeTestDb()
    })

    it('should return 200 and empty array', async () => {
        const res = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(200)
        console.log(res.body.items)
        expect(res.body.items.length).toBe(0)
    })

    it('should return 401 and empty array without autorization', async () => {
        const res = await req
            .get(SETTINGS.PATH.USERS)
            .expect(401)
    })

    //не должен создать user с некорректными входными данными
    it('shouldn\'t create user with incorrect input data', async () => {
        const newUser: CreateUserModel = {
            login: 'name1',
            password: 'description1',
            email: 'https://it-com' //incorrect input data
        }
        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .send(newUser) // отправка данных
            .expect(400)

        const res1 = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(200)
        expect(res1.body.items).toEqual([])
    })

    it('should get not empty array', async () => {
        //создаем нового user
        const newUser1 = createNewUser1
        const res = await createNewEntity(newUser1, SETTINGS.PATH.USERS)

        const res1 = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(200)
        //console.log(res1.body)
        expect(res1.body.items.length).toBe(1)
        expect(res1.body.items[0]).toEqual(res.body)
    })

    //не должен создать user с не оригинальным login
    it('shouldn\'t create user with unoriginal login', async () => {
        //создаем нового user
        const newUser1 = createNewUser1
        const res1 = await createNewEntity(newUser1, SETTINGS.PATH.USERS)

        const newUser2 = createNewUser1
        newUser2.login = newUser1.login

        const res2 = await req
            .post(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS }) //авторизация
            .send(newUser2) // отправка данных           
            .expect(400)

        const res3 = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(200)
        //console.log(res1.body)
        expect(res3.body.items.length).toBe(1)
        expect(res3.body.items[0]).toEqual(res1.body)
    })

    //найдем useer по login или по email
    it('should return user with specific login', async () => {
        //создаем два users
        const newUser1 = createNewUser1
        const res1 = await createNewEntity(newUser1, SETTINGS.PATH.USERS)
        const newUser2 = createNewUser2
        const res2 = await createNewEntity(newUser2, SETTINGS.PATH.USERS)

        const res3 = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(200)
        expect(res3.body.items.length).toBe(2)

        const res4 = await req
            .get(SETTINGS.PATH.USERS + `?searchLoginTerm=${newUser1.login}`)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(200)
        expect(res4.body.items).toEqual([res1.body])
    })

    //отсортируем users по login в одну и в другую сторону
    it('should sorting blogs by name', async () => {
        //создаем два users
        const newUser1 = createNewUser1
        const res1 = await createNewEntity(newUser1, SETTINGS.PATH.USERS)
        const newUser2 = createNewUser2
        const res2 = await createNewEntity(newUser2, SETTINGS.PATH.USERS)

        const res3 = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(200)
        expect(res3.body.items.length).toBe(2)

        const res4 = await req
            .get(SETTINGS.PATH.USERS + '?sortBy=login&sortDirection=desc')
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(200)
        expect(res4.body.items[0]).toEqual(res2.body)
        expect(res4.body.items[1]).toEqual(res1.body)

        const res5 = await req
            .get(SETTINGS.PATH.USERS + '?sortBy=login&sortDirection=asc')
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(200)
        expect(res5.body.items[0]).toEqual(res1.body)
        expect(res5.body.items[1]).toEqual(res2.body)
    })

    //удаление user и возвращение пустого массива
    it(`should delete blog and return empty array`, async () => {
        //создаем user
        const newUser1 = createNewUser1
        const res1 = await createNewEntity(newUser1, SETTINGS.PATH.USERS)

        //проверили, что user есть в базе данных
        const res2 = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(200)
        expect(res2.body.items).toEqual([res1.body])

        //удалим его
        await req
            .delete(SETTINGS.PATH.USERS + '/' + res1.body.id)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(204)
        //проверим, что действительно удалился
        const res3 = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(200)
        expect(res3.body.items).toEqual([])
    })

    //не должен удалить несуществующий user
    it(`shouldn't delete blog that not exist`, async () => {
        const nonExitingId = (new ObjectId()).toString()
        //создаем новый user
        const newUser1 = createNewUser1
        const res1 = await createNewEntity(newUser1, SETTINGS.PATH.USERS)

        //проверили, что user есть в базе данных
        const res2 = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(200)
        expect(res2.body.items).toEqual([res1.body])

        await req
            .delete(SETTINGS.PATH.USERS + '/' + nonExitingId)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(404)
        //проверим, что ничего не удалилось
        await req
            .get(SETTINGS.PATH.USERS + `?searchLoginTerm=${newUser1.login}`)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(200, res2.body)
    })
})