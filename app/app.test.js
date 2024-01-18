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
            expect(response.body.articles.article_id).toBe(1)
        })
        test('test for bad request errors ', async () => {
            const response = await request(app).get('/api/articles/(getartilclebyarticleid)');
            expect(400)
            expect(response.body.msg).toBe("invalid input type")
        })
        test('test for invalid id error ', async () => {
            const response = await request(app).get('/api/articles/99999999');
            expect(400)
            expect(response.body.msg).toBe("invalid id")
        });
  })
})


describe('GET',() => {
    describe('/api/articles', () => {
        test('return with an array of article objects, sorted by oldest first ', async () => {
            const response = await request(app).get('/api/articles');
            expect(200)
            expect(response.body.articles.length).toEqual(articleData.length)
            expect(response.body.articles).toBeSortedBy('created_at',{
                descending:true,
            })
            response.body.articles.forEach((article) => {
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
                        expect(typeof comment.votes).toBe("number")
                        expect(typeof comment.article_id).toBe("number")
                        expect(typeof comment.author).toBe("string")
                    })
                })
                test('test with bad request ', async () => {
                    const badRequest = await request(app).get('/api/articles/(getcommentsfromarticlebyarticleid)/comments')
                    expect(badRequest.body.msg).toBe("bad input - column doesn't exist")
                })
                test('test with invalid id ', async () => {
                    const invalidIdRequest = await request(app).get('/api/articles/9999999999/comments')
                    expect(invalidIdRequest.body.msg).toBe("invalid id")
                })
            })
        }) 
    })
  })


describe('POST',() => {
    describe('/api/articles', () => {
        describe('/:article_id', () => {
            describe('/comments', () => {
                test('accepts an object with author and body properties, returns the posted comment' ,() => {
                      return request(app)
                        .post('/api/articles/3/comments')
                        .send({
                            author: 'butter_bridge',
                            body: 'hello, great video.',
                          })
                        .expect(201)
                        .then((response) => {
                          expect(response.body.article_id).toBe(3);
                          expect(response.body.author).toBe('butter_bridge');
                          expect(response.body.body).toBe("hello, great video.");
                        })
                    })
                    test('400- error for post that is missing properties', () => {
                       const IncompleteComment ={
                        author:'lurker'
                       }
                       return request(app)
                       .post('/api/articles/4/comments')
                       .send(IncompleteComment)
                       .expect(400)
                       .then((response) => {
                        expect(response.body.msg).toBe("missing one or more properties")
                       })
                    })
                    test('400 - item Id does not exist ', () => {
                        const Comment ={
                            author:'lurker',
                            body: "hello chum"
                           }
                           return request(app)
                           .post('/api/articles/(postapiarticle)/comments')
                           .send(Comment)
                           .expect(400)
                           .then((response) => {
                            expect(response.body.msg).toBe("invalid input type")
                           })
                    })
                    test('400 - invalid id ', () => {
                        const Comment ={
                            author:'lurker',
                            body: "hello chum"
                           }
                           return request(app)
                           .post('/api/articles/99999/comments')
                           .send(Comment)
                           .expect(400)
                           .then((response) => {
                            expect(response.body.msg).toBe("invalid id")
                           })
                    })
                })
                })
               
        }) 
    })

    describe('PATCH',() => {
        describe('/api/articles', () => {
            describe('/:article_id', () => {
                    test('return with the updated article, with new amount of votes ', () => {
                        const updateArticle = {
                            inc_votes: 100
                        }
                        return request(app)
                        .patch(`/api/articles/1`)
                        .send(updateArticle)
                        .expect(200)
                        .then((response) => {
                            expect(response.body.article.votes).toEqual(200)
                            expect(response.body.article.article_id).toEqual(1)
                            expect(response.body.article.topic).toEqual('mitch')
                            expect(response.body.article.author).toEqual('butter_bridge')
                            expect(response.body.article.body).toEqual('I find this existence challenging')
                            expect(response.body.article.created_at).toEqual('2020-07-09T20:11:00.000Z')
                            expect(response.body.article.article_img_url).toEqual('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
                        })

                     
                    })
                    test('test with bad request', () => {
                        const updateArticle = {
                            inc_votes: 100000
                        }
                        return request(app)
                        .patch(`/api/articles/cat`)
                        .send(updateArticle)
                        .expect(404)
                        .then((response) => {
                            
                            expect(response.body.msg).toEqual("bad input - column doesn't exist")
                        })                       
                    })
                    test('test with invalid id ', () => {
                        const updateArticle = {
                            inc_votes: 500
                        }
                        return request(app)
                        .patch(`/api/articles/99999`)
                        .send(updateArticle)
                        .expect(404)
                        .then((error) => {
                            expect(error.body.msg).toEqual("invalid id")
                        })

                       
                    })
                    test('test if inc_votes is not a number ', () => {
                        const updateArticle = {
                            inc_votes: 'banana'
                        }
                        return request(app)
                        .patch(`/api/articles/1`)
                        .send(updateArticle)
                        .expect(404)
                        .then((error) => {
                            expect(error.body.msg).toEqual("bad input - column doesn't exist")
                            /// i need to update this to include a promise.all
                        })

                       
                    })
                })
            }) 
        })

        describe('DELETE',() => {
            describe('/api/comments', () => {
                describe('/:comment id', () => {
                        test('delete given comment by comment id, return with status 204 and no content ', () => {
                            return request(app)
                            .delete(`/api/comments/5`)
                            .expect(204)
                            .then((response) => {
                                expect(response.body).toEqual({})
                            })
                         
                        })
                        test('test with bad request', () => {
                            
                            return request(app)
                            .delete(`/api/comments/cat`)
                            
                            .expect(400)
                            .then((response) => {
                                expect(response.body.msg).toEqual("invalid input type")
                            })
    
                           
                        })
                        test('test with invalid id ', () => {
                            return request(app)
                            .delete(`/api/comments/9999`)
                            .expect(404)
                            .then((error) => {
                                expect(error.body.msg).toEqual("invalid id")
                            })
    
                           
                        })
                    })
                }) 
            })
describe('GET',() => {
            describe('/api/users', () => {
                test('return with an array of users objects, which have a "username", "name" and "avatar_url" property ', () => {
                    return request(app)
                    .get('/api/users')
                    .expect(200)
                    .then((response) => {
                        expect(response.body.users.length).not.toBe(0)
                        response.body.users.forEach((user) => {
                        expect(typeof user.username).toBe("string")
                        expect(typeof user.name).toBe("string")
                        expect(typeof user.avatar_url).toBe("string")  
                       })
                })   
           })
        });
      })

      describe('GET',() => {
        describe('/api/articles', () => {
            test('return with an array of article objects, sorted by oldest first ', async () => {
                const response = await request(app).get('/api/articles?topic=mitch');
                expect(200)
                expect(response.body.articles.length).toEqual(12) // there was only 1 article that didn't have the topic of 'mitch' so 13(totalarticles) - 1 = 12
                response.body.articles.forEach((article) => {
                 expect(typeof article.comment_count).toBe("string")   
                 expect(typeof article.article_id).toBe("number")   
                 expect(typeof article.title).toBe("string")
                 expect(article.topic).toBe("mitch")
                })
            })
            test('return error when topic does not exist', async () => {
                const response = await request(app).get('/api/articles?topic=kjhvblevb')
                expect(400)
                expect(response.body.msg).toBe("topic is not found")

            })
               
            })
            })

            describe('GET',() => {
                describe('/api/articles', () => {
                    describe('/:article_id', () => {
                            test('updated article should resopnd with comment_count ', async () => {
                                const response = await request(app).get(`/api/articles/1`);
                                expect(200)
                                expect(typeof response.body.articles.comment_count).toBe("string")
                                    expect(response.body.articles.votes).toEqual(100)
                                    expect(response.body.articles.article_id).toEqual(1)
                                    expect(response.body.articles.topic).toEqual('mitch')
                                    expect(response.body.articles.author).toEqual('butter_bridge')
                                    expect(response.body.articles.created_at).toEqual('2020-07-09T20:11:00.000Z')
                                    expect(response.body.articles.article_img_url).toEqual('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
                                })
                            })
                        })
                    })
