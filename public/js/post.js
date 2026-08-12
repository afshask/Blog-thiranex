const postContainer = document.getElementById("postContainer");
const commentsContainer = document.getElementById("commentsContainer");
const commentForm = document.getElementById("commentForm");

const postId = window.location.pathname.split("/")[2];

let currentUser = null;


// ===============================
// GET CURRENT USER
// ===============================

async function getCurrentUser() {

    try {

        const response =
            await fetch("/auth/current-user");

        if (!response.ok) {
            return null;
        }

        const data =
            await response.json();

        return data.user;

    } catch (error) {

        console.error(error);

        return null;
    }
}


// ===============================
// LOAD POST
// ===============================

async function loadPost() {

    try {

        const response =
            await fetch(`/posts/${postId}`);

        if (!response.ok) {
            throw new Error("Post not found");
        }

        const post =
            await response.json();

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


// ===============================
// LOAD COMMENTS
// ===============================

async function loadComments() {

    try {

        const response =
            await fetch(`/comments/post/${postId}`);

        if (!response.ok) {
            throw new Error("Failed to load comments");
        }

        const comments =
            await response.json();


        if (comments.length === 0) {

            commentsContainer.innerHTML = `
                <p>
                    No comments yet.
                    Be the first to comment!
                </p>
            `;

            return;
        }


        commentsContainer.innerHTML =
            comments.map(comment => {

                const isOwner =
                    currentUser &&
                    currentUser.id === comment.author._id;


                return `

                    <div class="comment">

                        <strong>
                            ${comment.author.name}
                        </strong>

                        <p>
                            ${comment.content}
                        </p>


                        ${
                            isOwner
                                ? `
                                    <button
                                        class="delete-comment-button"
                                        onclick="deleteComment('${comment._id}')"
                                    >
                                        Delete
                                    </button>
                                `
                                : ""
                        }

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);

        commentsContainer.innerHTML =
            "<p>Failed to load comments.</p>";
    }
}


// ===============================
// ADD COMMENT
// ===============================

if (commentForm) {

    commentForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const content =
                document.getElementById(
                    "commentContent"
                ).value;


            try {

                const response =
                    await fetch(
                        `/comments/post/${postId}`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                content
                            })
                        }
                    );


                const result =
                    await response.text();


                if (response.ok) {

                    document.getElementById(
                        "commentMessage"
                    ).textContent =
                        "Comment added successfully!";


                    document.getElementById(
                        "commentContent"
                    ).value = "";


                    await loadComments();


                } else {

                    document.getElementById(
                        "commentMessage"
                    ).textContent =
                        result;
                }


            } catch (error) {

                console.error(error);

                document.getElementById(
                    "commentMessage"
                ).textContent =
                    "Something went wrong.";
            }

        }
    );

}


// ===============================
// DELETE COMMENT
// ===============================

async function deleteComment(commentId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this comment?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `/comments/${commentId}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.text();


        if (response.ok) {

            alert(
                "Comment deleted successfully!"
            );

            await loadComments();


        } else {

            alert(result);
        }


    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong."
        );
    }
}


// ===============================
// INITIALIZE PAGE
// ===============================

async function initializePage() {

    currentUser =
        await getCurrentUser();


    await loadPost();

    await loadComments();
}


initializePage();