const postsContainer = document.getElementById("postsContainer");
const postForm = document.getElementById("postForm");


// ===============================
// LOAD CURRENT USER
// ===============================

async function getCurrentUser() {

    try {

        const response = await fetch("/auth/current-user");

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        return data.user;

    } catch (error) {

        console.error(error);

        return null;
    }
}


// ===============================
// LOAD ALL POSTS
// ===============================

async function loadPosts() {

    if (!postsContainer) {
        return;
    }

    try {

        const currentUser = await getCurrentUser();

        const response = await fetch("/posts");

        const posts = await response.json();


        if (posts.length === 0) {

            postsContainer.innerHTML = `
                <div class="empty-message">
                    <h3>No posts yet</h3>
                    <p>Be the first person to create a blog post!</p>
                </div>
            `;

            return;
        }


        postsContainer.innerHTML = posts.map(post => {

            let actionButtons = `
                <a
                    class="read-more"
                    href="/post/${post._id}"
                >
                    Read More
                </a>
            `;


            // Show Edit/Delete only to the post owner
            if (
                currentUser &&
                currentUser.id === post.author._id
            ) {

                actionButtons += `
                    <a
                        class="edit-button"
                        href="/edit-post/${post._id}"
                    >
                        Edit
                    </a>

                    <button
                        class="delete-button"
                        onclick="deletePost('${post._id}')"
                    >
                        Delete
                    </button>
                `;
            }


            return `
                <article class="post-card">

                    <h2>${post.title}</h2>

                    <p class="post-author">
                        By ${post.author.name}
                    </p>

                    <p class="post-content">
                        ${post.content}
                    </p>

                    <div class="post-actions">
                        ${actionButtons}
                    </div>

                </article>
            `;

        }).join("");


    } catch (error) {

        console.error(error);

        postsContainer.innerHTML = `
            <p>Failed to load posts.</p>
        `;
    }
}


// ===============================
// CREATE POST
// ===============================

if (postForm) {

    postForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const title =
            document.getElementById("title").value;

        const content =
            document.getElementById("content").value;


        try {

            const response = await fetch("/posts", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title,
                    content
                })
            });


            const result = await response.text();


            if (response.ok) {

                document.getElementById("message").textContent =
                    "Post created successfully!";

                setTimeout(() => {

                    window.location.href = "/";

                }, 1000);

            } else {

                document.getElementById("message").textContent =
                    result;
            }


        } catch (error) {

            console.error(error);

            document.getElementById("message").textContent =
                "Something went wrong.";
        }

    });
}


// ===============================
// DELETE POST
// ===============================

async function deletePost(postId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `/posts/${postId}`,
            {
                method: "DELETE"
            }
        );


        const result = await response.text();


        if (response.ok) {

            alert("Post deleted successfully!");

            await loadPosts();

        } else {

            alert(result);
        }


    } catch (error) {

        console.error(error);

        alert("Something went wrong.");
    }
}


// ===============================
// LOAD POSTS
// ===============================

loadPosts();