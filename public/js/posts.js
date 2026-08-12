const postsContainer = document.getElementById("postsContainer");
const postForm = document.getElementById("postForm");


// ===============================
// LOAD ALL POSTS
// ===============================

if (postsContainer) {

    async function loadPosts() {

        try {

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

                return `
                    <article class="post-card">

                        <h2>${post.title}</h2>

                        <p class="post-author">
                            By ${post.author.name}
                        </p>

                        <p class="post-content">
                            ${post.content}
                        </p>

                        <a
                            class="read-more"
                            href="/post/${post._id}"
                        >
                            Read More
                        </a>

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


    loadPosts();
}



// ===============================
// CREATE POST
// ===============================

if (postForm) {

    postForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;


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