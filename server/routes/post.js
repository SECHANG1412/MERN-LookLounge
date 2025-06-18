// ✅ server/routes/post.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/Post");
const User = require("../models/User");

// ✅ 게시글 저장 (POST)
router.post("/posts", auth, async (req, res) => {
    try {
        const { title, description, category, image } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ msg: "작성자 정보를 찾을 수 없습니다." });

        const newPost = new Post({
            title,
            description,
            category,
            image,
            author: user._id,
            date: new Date()
        });

        await newPost.save();
        res.status(201).json({ msg: "게시글 등록 완료!" });
    } catch (err) {
        console.error("게시글 등록 오류:", err);
        res.status(500).json({ msg: "서버 오류로 게시글 등록 실패" });
    }
});

// ✅ 게시글 목록 조회
// server/routes/post.js
// server/routes/post.js
router.get("/posts", auth, async (req, res) => {
    try {
      // 1) username만 가져오고 _id는 제외
      const posts = await Post.find()
        .sort({ date: -1 })
        .populate("author", "username -_id")
        .lean();               // 반드시 .lean() 해서 plain JS object로 변환
  
      // 2) author 필드를 문자열로 매핑
      const postsWithStringAuthor = posts.map((p) => ({
        ...p,
        author: p.author.username,
      }));
  
      // 3) 이렇게 내려주면, 프론트엔드에선 author가 무조건 문자열!
      res.json({ posts: postsWithStringAuthor });
    } catch (err) {
      console.error("게시글 조회 오류:", err);
      res.status(500).json({ msg: "서버 오류로 게시글 불러오기 실패" });
    }
  });
  
  

// ✅ 게시글 상세 조회
// server/routes/post.js
router.get("/posts/:id", auth, async (req, res) => {
    try {
      // username과 _id 둘 다 가져오도록 populate
      const post = await Post.findById(req.params.id)
        .populate("author", "username _id");
      if (!post) return res.status(404).json({ msg: "게시글을 찾을 수 없습니다." });
      res.json({ post });
    } catch (err) {
      console.error("게시글 상세 조회 오류:", err);
      res.status(500).json({ msg: "서버 오류로 상세조회 실패" });
    }
  });
  

// ✅ 게시글 삭제 (작성자만 가능)
router.delete("/posts/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: "게시글 없음" });

        if (post.author.toString() !== req.user.userId) {
            return res.status(403).json({ msg: "삭제 권한이 없습니다." });
        }

        await post.deleteOne();
        res.json({ msg: "게시글 삭제 성공" });
    } catch (err) {
        console.error("게시글 삭제 오류:", err);
        res.status(500).json({ msg: "게시글 삭제 실패" });
    }
});

// ✅ 게시글 수정 (PATCH /posts/:id)
router.patch("/posts/:id", auth, async (req, res) => {
    try {
      const { title, description, category, image } = req.body;
  
      // 1) 해당 게시글 찾기
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ msg: "게시글을 찾을 수 없습니다." });
  
      // 2) 작성자 권한 체크
      if (post.author.toString() !== req.user.userId) {
        return res.status(403).json({ msg: "수정 권한이 없습니다." });
      }
  
      // 3) 필드 업데이트
      post.title = title;
      post.description = description;
      post.category = category;
      // 이미지가 전송된 경우에만 덮어쓰기
      if (image) post.image = image;
  
      // 4) 저장 및 응답
      await post.save();
      res.json({ msg: "게시글 수정 성공", post });
    } catch (err) {
      console.error("게시글 수정 오류:", err);
      res.status(500).json({ msg: "게시글 수정 실패" });
    }
  });
  



// ✅ 댓글 등록
router.post("/posts/:id/comments", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: "게시글을 찾을 수 없습니다" });

        const { content } = req.body;
        const newComment = {
            author: req.user.username,
            content,
            date: new Date().toISOString(),
        };

        post.comments.push(newComment);
        await post.save();

        res.status(201).json({ msg: "댓글 등록 완료", post });
    } catch (err) {
        console.error("댓글 추가 오류:", err);
        res.status(500).json({ msg: "댓글 추가 실패" });
    }
});

// ✅ 댓글 삭제 (by commentId)
router.delete("/posts/:postId/comments/:commentId", auth, async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ msg: "게시글 없음" });

        const comment = post.comments.id(commentId);
        if (!comment) return res.status(404).json({ msg: "댓글 없음" });

        if (comment.author !== req.user.username) {
            return res.status(403).json({ msg: "삭제 권한 없음" });
        }

        comment.remove();
        await post.save();

        res.json({ msg: "댓글 삭제 성공", post });
    } catch (err) {
        console.error("댓글 삭제 오류:", err);
        res.status(500).json({ msg: "댓글 삭제 실패" });
    }
});

// ✅ 댓글 수정
router.patch("/posts/:postId/comments/:commentId", auth, async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { content } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ msg: "게시글 없음" });

        const comment = post.comments.id(commentId);
        if (!comment) return res.status(404).json({ msg: "댓글 없음" });

        if (comment.author !== req.user.username) {
            return res.status(403).json({ msg: "수정 권한 없음" });
        }

        comment.content = content;
        await post.save();

        res.json({ msg: "댓글 수정 성공", post });
    } catch (err) {
        console.error("댓글 수정 오류:", err);
        res.status(500).json({ msg: "댓글 수정 실패" });
    }
});

module.exports = router;
