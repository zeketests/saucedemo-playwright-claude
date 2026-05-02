import { test, expect } from '@playwright/test';
import { JSONPLACEHOLDER_BASE_URL, Post, User, Comment } from '../../data/api';

test.describe('API — JSONPlaceholder Posts', { tag: '@regression' }, () => {
  test('[API-01] GET /posts returns 100 posts with correct shape', async ({ request }) => {
    const response = await request.get(`${JSONPLACEHOLDER_BASE_URL}/posts`);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const posts: Post[] = await response.json();

    expect(Array.isArray(posts)).toBe(true);
    expect(posts).toHaveLength(100);

    const first = posts[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('userId');
    expect(first).toHaveProperty('title');
    expect(first).toHaveProperty('body');
    expect(typeof first.id).toBe('number');
    expect(typeof first.title).toBe('string');
  });

  test('[API-02] GET /posts/:id returns single post', async ({ request }) => {
    const response = await request.get(`${JSONPLACEHOLDER_BASE_URL}/posts/1`);

    expect(response.status()).toBe(200);

    const post: Post = await response.json();

    expect(post.id).toBe(1);
    expect(post.userId).toBe(1);
    expect(typeof post.title).toBe('string');
    expect(typeof post.body).toBe('string');
  });

  test('[API-03] GET /posts/:id returns 404 for non-existent post', async ({ request }) => {
    const response = await request.get(`${JSONPLACEHOLDER_BASE_URL}/posts/99999`);

    expect(response.status()).toBe(404);
  });

  test('[API-04] POST /posts creates a new post', async ({ request }) => {
    const newPost = {
      title: 'Test Post Title',
      body: 'Test post body content',
      userId: 1,
    };

    const response = await request.post(`${JSONPLACEHOLDER_BASE_URL}/posts`, {
      data: newPost,
    });

    expect(response.status()).toBe(201);

    const created: Post = await response.json();

    expect(created.title).toBe(newPost.title);
    expect(created.body).toBe(newPost.body);
    expect(created.userId).toBe(newPost.userId);
    expect(typeof created.id).toBe('number');
  });

  test('[API-05] PUT /posts/:id updates an existing post', async ({ request }) => {
    const updatedPost = {
      id: 1,
      title: 'Updated Title',
      body: 'Updated body content',
      userId: 1,
    };

    const response = await request.put(`${JSONPLACEHOLDER_BASE_URL}/posts/1`, {
      data: updatedPost,
    });

    expect(response.status()).toBe(200);

    const result: Post = await response.json();

    expect(result.id).toBe(1);
    expect(result.title).toBe(updatedPost.title);
    expect(result.body).toBe(updatedPost.body);
  });

  test('[API-06] PATCH /posts/:id partially updates a post', async ({ request }) => {
    const response = await request.patch(`${JSONPLACEHOLDER_BASE_URL}/posts/1`, {
      data: { title: 'Patched Title' },
    });

    expect(response.status()).toBe(200);

    const result: Post = await response.json();

    expect(result.id).toBe(1);
    expect(result.title).toBe('Patched Title');
  });

  test('[API-07] DELETE /posts/:id returns 200', async ({ request }) => {
    const response = await request.delete(`${JSONPLACEHOLDER_BASE_URL}/posts/1`);

    expect(response.status()).toBe(200);
  });

  test('[API-08] GET /posts/:id/comments returns comments for post', async ({ request }) => {
    const response = await request.get(`${JSONPLACEHOLDER_BASE_URL}/posts/1/comments`);

    expect(response.status()).toBe(200);

    const comments: Comment[] = await response.json();

    expect(Array.isArray(comments)).toBe(true);
    expect(comments.length).toBeGreaterThan(0);

    const first = comments[0];
    expect(first.postId).toBe(1);
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('email');
    expect(first).toHaveProperty('body');
  });

  test('[API-09] GET /posts supports filtering by userId query param', async ({ request }) => {
    const response = await request.get(`${JSONPLACEHOLDER_BASE_URL}/posts`, {
      params: { userId: 1 },
    });

    expect(response.status()).toBe(200);

    const posts: Post[] = await response.json();

    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every(p => p.userId === 1)).toBe(true);
  });
});

test.describe('API — JSONPlaceholder Users', { tag: '@regression' }, () => {
  test('[API-10] GET /users returns array of users', async ({ request }) => {
    const response = await request.get(`${JSONPLACEHOLDER_BASE_URL}/users`);

    expect(response.status()).toBe(200);

    const users: User[] = await response.json();

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);

    const first = users[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('username');
    expect(first).toHaveProperty('email');
  });

  test('[API-11] GET /users/:id returns single user', async ({ request }) => {
    const response = await request.get(`${JSONPLACEHOLDER_BASE_URL}/users/1`);

    expect(response.status()).toBe(200);

    const user: User = await response.json();

    expect(user.id).toBe(1);
    expect(typeof user.name).toBe('string');
    expect(user.email).toContain('@');
  });

  test('[API-12] GET /users/:id returns 404 for non-existent user', async ({ request }) => {
    const response = await request.get(`${JSONPLACEHOLDER_BASE_URL}/users/99999`);

    expect(response.status()).toBe(404);
  });
});
