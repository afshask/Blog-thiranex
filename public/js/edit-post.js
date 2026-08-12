const editPostForm =
    document.getElementById("editPostForm");

const postId =
    window.location.pathname.split("/")[2];


// Load existing post

async function loadPost() {

    try {

        const response =
            await fetch(`/posts/${postId}`);

        if (!response.ok) {
            throw new Error("Post not found");
        }

        const post = await response.json();

        document.getElementById("title").value =
            post.title;

        document.getElementById("content").value =
            post.content;

    } catch (error) {

        console.error(error);

        document.getElementById("message").textContent =
            "Failed to load post.";
    }
}


// Update post

editPostForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const title =
            document.getElementById("title").value;

        const content =
            document.getElementById("content").value;


        try {

            const response = await fetch(
                `/posts/${postId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        title,
                        content
                    })
                }
            );


            const result = await response.text();


            if (response.ok) {

                document.getElementById(
                    "message"
                ).textContent =
                    "Post updated successfully!";


                setTimeout(() => {

                    window.location.href =
                        `/post/${postId}`;

                }, 1000);

            } else {

                document.getElementById(
                    "message"
                ).textContent = result;
            }


        } catch (error) {

            console.error(error);

            document.getElementById(
                "message"
            ).textContent =
                "Something went wrong.";
        }

    }
);


loadPost();