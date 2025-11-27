import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import postsApi from '../../api/postsApi';
import './Study.css';

function StudyListPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [bookmarked, setBookmarked] = useState(() =>
    JSON.parse(localStorage.getItem('bookmarkedStudies') || '[]')
  );

  const [liked, setLiked] = useState(() =>
    JSON.parse(localStorage.getItem('likedStudies') || '[]')
  );

  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [sortOption, setSortOption] = useState('latest');

  // ✅ posts 전체 조회 (백엔드 /posts 에서 가져옴)
  useEffect(() => {
    const load = async () => {
      try {
        const response = await postsApi.getPosts();
        setPosts(response.data);   // title, content 그대로 사용 가능
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  // 로컬 저장 갱신
  useEffect(() => {
    localStorage.setItem('bookmarkedStudies', JSON.stringify(bookmarked));
  }, [bookmarked]);

  useEffect(() => {
    localStorage.setItem('likedStudies', JSON.stringify(liked));
  }, [liked]);

  const handleWriteClick = () => navigate('/study/write');

  const toggleBookmark = (postId) => {
    setBookmarked(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleLike = (postId) => {
    setLiked(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  // 검색 필터
  let filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 찜 필터
  if (showBookmarkedOnly) {
    filteredPosts = filteredPosts.filter(post => bookmarked.includes(post.id));
  }

  // 정렬
  filteredPosts.sort((a, b) => {
    if (sortOption === 'latest') return b.id - a.id;
    if (sortOption === 'bookmarks')
      return (bookmarked.includes(b.id) ? 1 : 0) - (bookmarked.includes(a.id) ? 1 : 0);
    return 0;
  });

  return (
    <div className="study-page-container">
      <h1>스터디 목록</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="스터디 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '300px' }}
        />

        <button className="study-page-button" onClick={handleWriteClick}>
          글쓰기
        </button>

        <button
          className="study-page-button"
          onClick={() => setShowBookmarkedOnly(prev => !prev)}
        >
          {showBookmarkedOnly ? '전체보기' : '찜한 스터디만'}
        </button>

        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="latest">최신순</option>
          <option value="bookmarks">찜많은순</option>
        </select>
      </div>

      <ul className="study-list">
        {filteredPosts.map((post) => (
          <li key={post.id} className="study-item">
            <div
              className="study-item-content"
              onClick={() => navigate(`/study/${post.id}`)}
            >
              <div className="study-item-header">
                <h3 className="study-item-title">{post.title}</h3>
                <span className="study-item-status">모집중</span>
              </div>

              <p>{post.content.slice(0, 100)}...</p>
            </div>

            <div className="study-item-actions">
              <button
                onClick={(e) => { e.stopPropagation(); toggleBookmark(post.id); }}
                className="bookmark-button"
              >
                {bookmarked.includes(post.id) ? '❤️ 찜 취소' : '🤍 찜하기'}
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                className="bookmark-button"
              >
                {liked.includes(post.id) ? '💖 좋아요 취소' : '🤍 좋아요'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudyListPage;