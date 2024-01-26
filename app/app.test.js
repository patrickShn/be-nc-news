const app = require('./appOld.js')
const request = require('supertest')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data/index.js')
const endpoints = require('../endpoints.json')




beforeEach(() => seed(testData));
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
            const response = await request(app).get('/')
            expect(200)
            expect(response.body).toEqual(endpoints)
        });
  })
})

describe('GET',() => {
    describe('/api/articles/:article-id', () => {
        test('return with an object describing all endpoints available ', async () => {
            const response = await request(app).get('/api/articles/1');
            console.log(response.body)
            expect(response.status).toBe(200)
            expect(response.body.articles.article_id).toBe(1)
        })
        test('test for bad request errors ', async () => {
            const response = await request(app).get('/api/articles/(getartilclebyarticleid)');
            expect(response.status).toBe(400)
            expect(response.body.msg).toBe("invalid input type")
        })
        test('test for invalid id error ', async () => {
            const response = await request(app).get('/api/articles/99999999');
            expect(response.status).toBe(404)
            expect(response.body.msg).toBe("invalid id")
        });
  })
})


describe('GET',() => {
    describe('/api/articles', () => {
        test('return with an array of article objects, sorted by oldest first ', async () => {
            const response = await request(app).get('/api/articles');
            expect(response.status).toBe(200)
            console.log(response.body)
            expect(response.body.articles).toBeSortedBy('created_at',{
                descending:true,
            })
            response.body.articles.forEach((article) => {
             expect(typeof article.comment_count).toBe("string")   
             expect(typeof article.title).toBe("string")
            })
        })
        test('return with an array of article objects, filtered by topic', async () => {
            const response = await request(app).get('/api/articles?topic=mitch');
            expect(response.status).toBe(200)
            response.body.articles.forEach((article) => {
             expect(typeof article.article_id).toBe("number")   
             expect(typeof article.title).toBe("string")
             expect(article.topic).toBe("mitch")
            })
        })
        test('return error when topic does not exist', async () => {
            const response = await request(app).get('/api/articles?topic=kjhvblevb')
            expect(response.body.msg).toBe("topic is not found")
            expect(response.body.status).toBe(404)
        })
       test('should accept "sort_by" and "order" queries and order the data accordingly',() => {
            return request(app)
            .get(`/api/articles?sort_by=article_id&order=ASC`)
            .then((response) => {
                const articles = response.body.articles;
                expect(articles).toBeSortedBy('article_id',{
                    descending:false
                })
            })
        })
        test('should return rejected promise if sort_by is not valid',() => {
                return request(app)
                .get(`/api/articles?sort_by=article_img_url&order=ASC`)
                .expect(404)
                .then((response) => {
                   expect(response.body.msg).toBe("invalid sort_by query")
                })
       }) 
       test('should return rejected promise if order is not valid',() => {
        return request(app)
        .get(`/api/articles?sort_by=article_id&order=wertghy`)
        .expect(404)
        .then((response) => {
           expect(response.body.msg).toBe("invalid order type")
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
        test('accepts a new article, returns the new article with the properties.' ,() => {
            const newArticle = 
                {
                    title: "the meaning of maths",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "2+2=5",
                    article_img_url:
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                  }
            return request(app)
                    .post(`/api/articles`)
                    .send(newArticle)
                    .expect(201)
                    .then((response) => {
                        expect(response.body.article.length).not.toBe(0)
                        expect(response.body.article.author).toBe("butter_bridge")
                        expect(response.body.article.topic).toBe("mitch")
                        expect(response.body.article.title).toBe("the meaning of maths")
                        expect(response.body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
                        expect(response.body.article.article_id).toBe(14)
                        expect(response.body.article.votes).toBe(0)
                        expect(typeof response.body.article.created_at).toBe("string")
                        expect(response.body.article.comment_count).toBe(0)
                    })
        })
        test('return error if topic is not found',() => {
            const newArticle = {
                title: "the meaning of maths",
                topic: "balbalbla",
                author: "butter_bridge",
                body: "2+2=5",
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              } 
                return request(app)
                        .post('/api/articles')
                        .send(newArticle)
                        .expect(404)
                        .then((err) => {
                            expect(err.body.msg).toBe("topic is not found")
                        })
        })
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
                          expect(response.body.votes).toBe(0);
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
                            inc_votes: -1
                        }
                        return request(app)
                        .patch(`/api/articles/1`)
                        .send(updateArticle)
                        .expect(200)
                        .then((response) => {
                            expect(response.body.article.votes).toEqual(99)
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
                    test('updated article should resopnd with comment_count ', async () => {
                        const response = await request(app).get(`/api/articles/1`);
                        expect(response.status).toBe(200)
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
                        console.log(response.body)
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
        describe('/api/users/:username', () => {
            test('return a user by the username ', () => {
                return request(app)
                .get('/api/users/butter_bridge')
                .expect(200)
                .then((response) => {
                    expect(response.body.user.length).toBe(1)
                    response.body.user.forEach((user) => {
                        
                    expect(user.username).toBe("butter_bridge")
                    expect(user.name).toBe("jonny")
                    expect(user.avatar_url).toBe("https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg")  
                   })
            })   
       })   
            test('return error if username does not exist',() => {
                return request(app)
                .get('/api/users/dljfvhbejlv')
                .expect(404)
                .then((response) => {

                    expect(response.body.msg).toBe("username not found")
                })
            })
    });
  })


  describe('PATCH',() => {
    describe('/api/comments', () => {
        describe('/:comment id', () => {
                test('update the votes on a comment given the comments id ', () => {
                    const voteObj = {
                        inc_votes : 1
                    }
                    return request(app)
                    .patch(`/api/comments/1`)
                    .send(voteObj)
                    .expect(200)
                    .then((comment) => {
                        expect(comment.body.votes).toBe(17)
                    })
                 
                })
                test('check that negative votes decreases votes ', () => {
                    const voteObj = {
                        inc_votes : -10
                    }
                    return request(app)
                    .patch(`/api/comments/1`)
                    .send(voteObj)
                    .expect(200)
                    .then((comment) => {
                        expect(comment.body.votes).toBe(6)
                        expect(comment.body.comment_id).toBe(1)
                        expect(comment.body.body).toBe("Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!")
                        expect(comment.body.author).toBe("butter_bridge")
                        expect(comment.body.created_at).toBe('2020-04-06T12:17:00.000Z')
                    })
                 
                })
                test('test with bad request', () => {
                    const voteObj = {
                        inc_votes : 1
                    }
                    return request(app)
                    .patch(`/api/comments/cat`)
                    .send(voteObj)
                    .expect(400)
                    .then((response) => {
                        expect(response.body.msg).toEqual("invalid input type")
                    })

                   
                })
                test('test with invalid id ', () => {
                    const voteObj = {
                        inc_votes : 1
                    };
                    return request(app)
                    .patch(`/api/comments/9999`)
                    .send(voteObj)
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
                    .patch(`/api/comments/1`)
                    .send(updateArticle)
                    .expect(404)
                    .then((error) => {
                        expect(error.body.msg).toEqual("bad input - column doesn't exist")
                    }) 
                })
            })
        }) 
    })






