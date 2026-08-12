const postContainer = document.getElementById("postContainer");
const commentsContainer = document.getElementById("commentsContainer");
const commentForm = document.getElementById("commentForm");

const postId = window.location.pathname.split("/")[2];


// Load the selected post
async function loadPost() {
    try {
        const response = await fetch(`/posts/${postId}`);

        if (!response.ok) {
            throw new Error("Post not found");
        }

        const post = await response.json();

        postContainer.innerHTML = `
            <h1>${post.title}</h1>

            <p class="post-author">
                By ${post.author.name}
            </p>

            <p class="post-content">
                ${post.content}
            </p>
        `;

    } catch (error) {
        console.error(error);

        postContainer.innerHTML = `
            <h2>Post not found</h2>
        `;
    }
}


// Load comments
async function loadComments() {
    try {
        const response =
            await fetch(`/comments/post/${postId}`);

        const comments = await response.json();

        if (comments.length === 0) {
            commentsContainer.innerHTML = `
                <p>No comments yet. Be the first to comment!</p>
            `;

            return;
        }

        commentsContainer.innerHTML = comments.map(comment => `
            <div class="comment">

                <strong>
                    ${comment.author.name}
                </strong>

                <p>
                    ${comment.content}
                </p>

            </div>
        `).join("");

    } catch (error) {
        console.error(error);

        commentsContainer.innerHTML =
            "<p>Failed to load comments.</p>";
    }
}


// Add a comment
if (commentForm) {

    commentForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const content =
            document.getElementById("commentContent").value;

        try {

            const response = await fetch(
                `/comments/post/${postId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        content
                    })
                }
            );

            const result = await response.text();

            if (response.ok) {

                document.getElementById(
                    "commentMessage"
                ).textContent =
                    "Comment added successfully!";

                document.getElementById(
                    "commentContent"
                ).value = "";

                loadComments();

            } else {

                document.getElementById(
                    "commentMessage"
                ).textContent = result;
            }

        } catch (error) {

            console.error(error);

            document.getElementById(
                "commentMessage"
            ).textContent =
                "Something went wrong.";
        }
    });
}


// Run when page loads
loadPost();
loadComments();