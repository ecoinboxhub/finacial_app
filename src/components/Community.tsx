import React, { useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { api } from '../api/client';
import type { User, ForumPost } from '../types';

interface CommunityProps {
  user: User | null;
  onAuthRequest: () => void;
}

const defaultPosts: ForumPost[] = [
  {
    id: 'post_1',
    title: 'Is it a good time to start buying stocks right now?',
    category: 'Stocks',
    body: 'I have $2,000 saved up in my HYSA as an emergency fund, and another $500 that I want to put into the stock market. With all the news about inflation, should I wait or dollar-cost average (DCA) into an S&P 500 ETF?',
    author: 'Adebayo Johnson',
    likes: 12,
    likedBy: [],
    comments: [
      { author: 'Jane Smith', text: 'Definitely start with DCA! Putting in $50 a week is a great way to average out market ups and downs.' },
      { author: 'Michael Chen', text: 'Great job having your emergency fund sorted first! That is the most important step.' },
    ],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'post_2',
    title: 'How I saved $5,000 using the 50/30/20 budgeting rule',
    category: 'Budgeting',
    body: 'I used to struggle with living paycheck to paycheck. Six months ago, I started automating my savings. 50% for rent/bills, 30% for fun, and 20% went straight to my high-yield savings account the morning I got paid. Highly recommend automating it!',
    author: 'Chidi Okafor',
    likes: 24,
    likedBy: [],
    comments: [
      { author: 'Adebayo Johnson', text: 'Automating it is the secret. If I do not see the money, I do not spend it!' },
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'post_3',
    title: 'Should I pay off my credit card or invest in Treasury Bills?',
    category: 'Credit & Debt',
    body: 'My credit card debt has an interest rate of 19%. Meanwhile, short term Treasury Bills yield around 5.2%. It seems like paying off the credit card is the smarter move because it gives me a guaranteed 19% return on that money, right?',
    author: 'Emily Watson',
    likes: 18,
    likedBy: [],
    comments: [
      { author: 'Chidi Okafor', text: 'Yes, 100%! Paying off 19% debt is mathematically way better than earning 5.2% on investments. Pay that off first!' },
    ],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export default function Community({ user, onAuthRequest }: CommunityProps) {
  const addToast = useToast();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newBody, setNewBody] = useState('');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await api.getPosts();
      setPosts(data);
    } catch {
      // Fall back to localStorage
      const stored = localStorage.getItem('fin_posts');
      if (stored) {
        setPosts(JSON.parse(stored));
      } else {
        localStorage.setItem('fin_posts', JSON.stringify(defaultPosts));
        setPosts(defaultPosts);
      }
    }
  };

  const savePosts = (updatedPosts: ForumPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('fin_posts', JSON.stringify(updatedPosts));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onAuthRequest();
      return;
    }

    if (!newTitle.trim() || !newBody.trim()) return;

    try {
      const newPost = await api.createPost(newTitle, newCategory, newBody);
      setPosts(prev => [newPost, ...prev]);
    } catch {
      // Fall back to local
      const newPost: ForumPost = {
        id: `post_${Date.now()}`,
        title: newTitle,
        category: newCategory,
        body: newBody,
        author: user.name,
        likes: 0,
        likedBy: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };
      const updated = [newPost, ...posts];
      savePosts(updated);
    }

    setNewTitle('');
    setNewBody('');
    setShowCreate(false);
    addToast('📝 Your post has been published!', 'success', 3000);
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      onAuthRequest();
      return;
    }

    try {
      const updatedPost = await api.toggleLike(postId);
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    } catch {
      // Fall back to local
      const updated = posts.map(post => {
        if (post.id === postId) {
          const likedBy = post.likedBy || [];
          const index = likedBy.indexOf(user.email);
          let newLikes = post.likes;
          let newLikedBy = [...likedBy];

          if (index === -1) {
            newLikes += 1;
            newLikedBy.push(user.email);
            addToast('👍 You liked this post!', 'info', 2000);
          } else {
            newLikes -= 1;
            newLikedBy.splice(index, 1);
          }

          return { ...post, likes: newLikes, likedBy: newLikedBy };
        }
        return post;
      });
      savePosts(updated);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!user) {
      onAuthRequest();
      return;
    }

    if (!commentText.trim()) return;

    try {
      const updatedPost = await api.addComment(postId, commentText);
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    } catch {
      // Fall back to local
      const updated = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...(post.comments || []),
              { author: user.name, text: commentText },
            ],
          };
        }
        return post;
      });
      savePosts(updated);
    }

    setCommentText('');
    addToast('💬 Comment added!', 'success', 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="forum-header-row">
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800' }}>Community Q&A Forum</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Discuss financial concepts, share ideas, and ask questions with other students.</p>
        </div>
        <button
          className="auth-button login"
          onClick={() => {
            if (!user) onAuthRequest();
            else setShowCreate(!showCreate);
          }}
        >
          {showCreate ? 'Close Editor' : '✍ Create Post'}
        </button>
      </div>

      {showCreate && user && (
        <div className="card create-post-card">
          <h3 className="card-title">Share a Topic or Question</h3>
          <form onSubmit={handleCreatePost}>
            <div className="input-group" style={{ marginBottom: '12px' }}>
              <label className="input-label-row">Category</label>
              <select
                className="number-input-field"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
              >
                <option value="General">General Financial Literacy</option>
                <option value="Budgeting">Budgeting & Savings</option>
                <option value="Stocks">Stocks, ETFs & Bonds</option>
                <option value="Crypto">Cryptocurrency</option>
                <option value="Real Estate">Real Estate & REITs</option>
                <option value="Debts">Debt Management</option>
              </select>
            </div>
            <input
              type="text"
              className="post-input-title"
              placeholder="What is your question or topic title?"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              required
            />
            <textarea
              className="post-textarea"
              placeholder="Describe your situation, share your learnings, or explain your financial question in detail..."
              value={newBody}
              onChange={e => setNewBody(e.target.value)}
              required
            />
            <button type="submit" className="post-submit-btn">Publish Post</button>
          </form>
        </div>
      )}

      <div className="posts-list">
        {posts.map(post => {
          const isLiked = post.likedBy?.includes(user?.email || '');
          const isCommentsExpanded = activeCommentsPostId === post.id;

          return (
            <div key={post.id} className="card post-item-card">
              <div className="post-author-row">
                <div className="post-author-avatar">{post.author.charAt(0).toUpperCase()}</div>
                <div className="post-author-info">
                  <span className="post-author-name">{post.author}</span>
                  <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="badge info" style={{ marginLeft: 'auto' }}>{post.category}</span>
              </div>

              <div>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-content" style={{ marginTop: '8px', whiteSpace: 'pre-line' }}>{post.body}</p>
              </div>

              <div className="post-actions-row">
                <button
                  className={`post-action-btn ${isLiked ? 'active' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  👍 {post.likes} Likes
                </button>
                <button
                  className="post-action-btn"
                  onClick={() => setActiveCommentsPostId(isCommentsExpanded ? null : post.id)}
                >
                  💬 {post.comments?.length || 0} Comments
                </button>
              </div>

              {isCommentsExpanded && (
                <div className="comments-section">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {post.comments?.map((comment, cIdx) => (
                      <div key={cIdx} className="comment-item">
                        <div className="comment-author-row"><span>👤 {comment.author}</span></div>
                        <p className="comment-body">{comment.text}</p>
                      </div>
                    ))}
                    {(!post.comments || post.comments.length === 0) && (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>
                        No comments yet. Start the conversation!
                      </div>
                    )}
                  </div>

                  <form className="comment-input-row" onSubmit={(e) => handleCommentSubmit(e, post.id)}>
                    <input
                      type="text"
                      className="comment-text-input"
                      placeholder={user ? 'Write a helpful response...' : 'Log in to join discussion'}
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      disabled={!user}
                      required
                    />
                    <button type="submit" className="comment-submit-btn" disabled={!user}>Reply</button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
