var Quiz = require('../models/quiz')
var User = require('../models/user')
var Question = require('../models/question')
const jwt = require('jsonwebtoken')

exports.createQuiz = (req, res) => {
    whoid = req.userId;
    whoemail = req.email
    let quiz = new Quiz({
        quizname: req.body.quizname,
        quizdescription: req.body.description,
        owner: whoid,
        owneremail: whoemail
    });
    quiz.save((error, qz) => {
        if (error) {
            console.log(error);
            res.send({ msg: "some error!" });
        }
        else {

            res.status(200).send({ message: "yes quiz added!!" })
        }
    })
}

exports.getUploadquiz = (req, res) => {
    Quiz.find({ owner: req.userId, upload: false }, (err, qz) => {
        if (err) {
            console.log(error);
            res.send({ msg: "some error!" });
        }
        else {
            res.send({ quiz: qz });
        }
    })
}

exports.seeStudent = (req, res) => {
    User.find({ role: "student" }, (err, usr) => {
        if (err) {
            console.log(error);
            res.send({ msg: "some error!" });
        }
        else {
            res.send({ user: usr });
        }
    })
}

exports.blockStudent = (req, res) => {
    let id = req.params.id
    User.updateOne({ _id: id }, { blocked: true }, function (err, user) {
        if (err) {
            console.log(err)
            res.status(500).send({ msg: "something went wrong!!" })
        }
        else {
            console.log("blocked user");
            res.status(201).send({ message: "blocked user!" });
        }
    })

}
exports.unblockStudent = (req, res) => {
    let id = req.params.id
    User.updateOne({ _id: id }, { blocked: false }, function (err, user) {
        if (err) {
            console.log(err)
            res.status(500).send({ msg: "something went wrong!!" })
        }
        else {
            console.log("unblocked user");
            res.status(201).send({ message: "unblocked user!" });
        }
    })
}
exports.addQuestion = (req, res) => {

    Question.find({ quizid: req.body.quizid }, (err, q) => {
        if (err) {
            console.log(error);
            res.send({ msg: "some error!" });
        }
        else {
            var question = new Question({
                quizid: req.body.quizid,
                questionId: q.length + 1,
                questionText: req.body.questionText,
                answer: req.body.answer,
                options: req.body.options
            });

            question.save((error, qsn) => {
                if (error) {
                    console.log(error);
                    res.send({ msg: "some error!" });
                }
                else {
                    res.status(200).send({ message: "yes question added!!" })
                }
            })
        }
    })
}

exports.uploadQuiz = (req, res) => {
    console.log("upload back");
    console.log(req.body);
    Question.find({ quizid: req.body.id }, (err, qz) => {
        if (err) {
            console.log(error);
            res.send({ msg: "some error!" });
        }
        else {
            console.log(qz.length);
            if (qz.length < 5) {
                res.send({ msg: "You must have 5 question in the quiz for upload quiz!!" });
            }
            else {
                Quiz.updateOne({ _id: req.body.id }, { upload: true }, function (err, user) {
                    if (err) {
                        console.log(err)
                        res.send({ msg: "something went wrong!!" })
                    }
                    else {
                        const io = req.app.get('io');
                        io.emit("quizcrud", "Quiz Curd done here");
                        res.send({ message: "quiz uploaded!" });
                    }
                })

            }

        }
    })

}

exports.deleteQuiz = (req, res) => {
    let id = req.params.id
   
    Quiz.deleteOne({ _id: id }, (err) => {
        if (err) {
            res.send({ msg: "Somthing went wrong!!" });
            console.log("err in delete by admin");
        }
    })
    Question.deleteMany({ quizid: id }, (err) => {
        if (err) {
            res.send({ msg: "Somthing went wrong!!" });
            console.log("err in delete by admin");
        }
    })
    const io = req.app.get('io');
    io.emit("quizcrud", "Quiz Curd done here");
    res.status(200).send({ msg: "yes deleted user by admin" })
}


exports.getHomequiz = (req, res) => {
    Quiz.find({ owner: req.userId, upload: true }, (err, qz) => {
        if (err) {
            console.log(error);
            res.send({ msg: "some error!" });
        }
        else {
            res.send({ quiz: qz });
        }
    })
}

exports.getAllQuestion = (req, res) => {
    
    Question.find({ quizid: req.params.id }, (err, qz) => {
        if (err) {
            console.log(error);
            res.send({ errormsg: "some error!" });
        }
        else {
            res.send({ msg: qz });
        }
    })
   
}


exports.deleteQuestion = (req, res) => {
    let id = req.params.id
    Question.deleteOne({ _id: id }, (err) => {
        if (err) {
            res.send({ msg: "Somthing went wrong!!" });
            console.log("err in delete  question by admin");
        }
    })
    res.send({ msg: "yes deleted user by admin" })
}

exports.verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send("unauthorized req")
    }
    let token = req.headers.authorization.split(' ')[1]
  
    if (token == 'null') {
        return res.status(401).send("unauthorized req")
    }
    let payload = jwt.verify(token, 'secretkey')
    if (!payload) {
        return res.status(401).send("unauthorized req")
    }
   
    req.userId = payload.subject
    req.email = payload.email;
   
    next()
}