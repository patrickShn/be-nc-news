const app = require('./app.js')
const request = require('supertest')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index.js')
const endpoints = require('../endpoints.json')




beforeEach(() => seed({articleData, commentData, topicData, userData}));
afterAll(() => db.end());

describe('GET',() => {
    describe('/api/topics', () => {
        test('return with an array of topic objects, which have a "slug" and "description" property ', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
               response.body.topics.forEach((topic) => {
                expect(typeof topic.description).toBe("string")
                expect(typeof topic.slug).toBe("string")
               })
            })
        });
  })
})

describe('GET',() => {
    describe('/api', () => {
        test('return with an object describing all endpoints available ', async () => {
            const response = await request(app).get('/api')
            expect(200)
            expect(response.body).toEqual(endpoints)
        });
  })
})

describe('GET',() => {
    describe('/api/articles/:article-id', () => {
        test('return with an object describing all endpoints available ', async () => {
            const response = await request(app).get('/api/articles/1');
            expect(200)
            expect(response.body.article_id).toBe(1)
        })
        test('test for bad request errors ', async () => {
            const response = await request(app).get('/api/articles/dog');
            expect(400)
            expect(response.body.msg).toBe("Bad Request")
        })
        test('test for invalid id error ', async () => {
            const response = await request(app).get('/api/articles/99999999');
            expect(404)
            expect(response.body.msg).toBe("invalid id")
        });
  })
})


describe('GET',() => {
    describe('/api/articles', () => {
        test('return with an array of article objects, sorted by oldest first ', async () => {
            const response = await request(app).get('/api/articles');
            expect(200)
            
            expect(response.body.length).toEqual(articleData.length)
            expect(response.body).toBeSortedBy('created_at',{
                descending:true,
            })
            response.body.forEach((article) => {
             expect(typeof article.comment_count).toBe("string")   
             expect(typeof article.title).toBe("string")
             //unsure of how to test number is correct
            })
        })
  })
})

describe('GET',() => {
    describe('/api/articles', () => {
        describe('/:article_id', () => {
            describe('/comments', () => {
                test('return with an array of comment objects, sorted by most recent first ', async () => {
                    const commentsResponse = await request(app).get('/api/articles/3/comments');
                    expect(Array.isArray(commentsResponse.body)).toBe(true)
                    expect(commentsResponse.body).toBeSortedBy("created_at",{
                        descending:true
                    })
                    commentsResponse.body.forEach((comment) => {
                        expect(comment.article_id).toBe(3)
                        expect(typeof comment.comment_id).toBe("number")
                    })
                })
                test('test with bad request ', async () => {
                    const badRequest = await request(app).get('/api/articles/dog/comments')
                    expect(badRequest.body.msg).toBe("psql error")
                })
                test('test with invalid id ', async () => {
                    const invalidIdRequest = await request(app).get('/api/articles/9999999999/comments')
                    expect(invalidIdRequest.body.msg).toBe("invalid id")
                })
            })
        }) 
    })
  })


