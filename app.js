
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabaseUrl = 'https://opjxgfjfjvcexhizvyar.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wanhnZmpmanZjZXhoaXp2eWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3ODMzMTUsImV4cCI6MjA0ODM1OTMxNX0.Vx5dbIopGNk2EU825CEPSVU5fIrlBp0d2yJi1fL_A80';

const supabase = createClient(supabaseUrl, supabaseKey);


// HANDLING THE FEATURED POSTS, LIMITED TO JUST 4 POST AND TAKES ONLY THE PICTURE, SLUG AND TITLE

const fetchRecentBlogs = async () => {
    const { data, error } = await supabase
        .from('BLOGS')
        .select('id, blogTitle, created_at, Slug, blogImage')
        .order('created_at', { ascending: false })
        .limit(4);

    if (error) {
        console.error('Error fetching recent blogs:', error);
    } else {
        console.log('Recent Blogs:', data);

        // Getting the featuredPost container
        const featuredPost = document.getElementById('featuredPost');

        // Clearing existing content
        featuredPost.innerHTML = `
            <div class="feature-posts">
                <a href="single-post.html" class="feature-post-item">                       
                    <span>Featured Posts</span>
                </a>
            </div>
        `;

        // Calling the Appending Container
        const featurePostsContainer = featuredPost.querySelector('.feature-posts');

        // Populating Dynamically
        data.forEach(element => {
            let newDiv = document.createElement('a');
            newDiv.setAttribute('href', `single-post.html?slug=${element.Slug}`); // Dynamic href
            newDiv.setAttribute('class', 'feature-post-item');
            newDiv.innerHTML = `
                <img src="${element.blogImage}" class="w-100" alt="">
                <div class="feature-post-caption">${element.blogTitle}</div>
            `;

            featurePostsContainer.appendChild(newDiv);
        });
    }
};

fetchRecentBlogs()


// THE MAIN LONG POSTS
let population = document.getElementById('population')
const longPost = async () => {
    const { data, error } = await supabase
        .from('BLOGS')
        .select('id, blogTitle, created_at, Slug, blogImage, blogCategory, blogDate, blogContent, blogAuthor')
        .order('created_at', { ascending: false })
        .limit(7);

    if (error) {
        console.error('Error fetching recent blogs:', error);
    } else {
        // console.log('Recent Blogs:', data);
        
        data.forEach(element => {


            // SLICING/TRUNCATING THE BLOG CONTENT
            const truncateContent = (content) => {
                const words = content.split(' ');
                const wordLimit = Math.ceil(words.length * 0.1);
                return `${words.slice(0, wordLimit).join(' ')}...`;
            };

            // POPULATING THE FRONTEND
            let newDiv = document.createElement('div')
            newDiv.setAttribute('class', 'card')
            newDiv.innerHTML = `
            
               <div class="card-header text-center">
                        <h5 class="card-title">${element.blogTitle}</h5> 
                        <small class="small text-muted">${element.blogDate} 
                            <span class="px-2">-</span>
                        </small>
                </div>
                <div class="card-body">
                        <div class="blog-media">
                            <img src="${element.blogImage}" alt="" class="w-100">
                            <a href="#" class="badge badge-primary">${element.blogCategory}</a>     
                        </div>  
                        <p class="my-3">${truncateContent(element.blogContent)}</p>
                </div>
                    
                <div class="card-footer d-flex justify-content-between align-items-center flex-basis-0">
                        <button class="btn btn-primary circle-35 mr-4"><i class="ti-back-right"></i></button>
                        <a href="${window.location.origin}/single-post.html?slug=${element.Slug}" class="btn btn-outline-dark btn-sm">READ MORE</a>
                        <a href="#" class="text-dark small text-muted">By : ${element.blogAuthor}</a>
                </div>             
            
            `
            population.appendChild(newDiv)
        });



    }
};

longPost()


// THE INSTAGRAM POSTS

const instaPosts = async () => {
    const { data, error } = await supabase
        .from('INSTAGRAM')
        .select('id, instaLink, created_at, instaPhoto')
        .order('created_at', { ascending: false })
        .limit(6);

    if (error) {
        console.error('Error fetching recent blogs:', error);
    } else {
        // console.log('Recent Blogs:', data);

        // Getting the featuredPost container
        const featuredPost = document.getElementById('instaPosters');

        // Clearing existing content
        featuredPost.innerHTML = `
            <div class="instagram-wrapper mt-5">
                <div class="ig-id">
                    <a href="https://www.instagram.com/akinwumi8767?igsh=YzljYTk1ODg3Zg==">Follow Paean On Instagram</a>
                </div>
            </div>
        `;

        // Calling the Appending Container
        const featurePostsContainer = featuredPost.querySelector('.instagram-wrapper');

        // Populating Dynamically
        data.forEach(element => {
            let newDiv = document.createElement('a');
            newDiv.setAttribute('href', `${element.instaLink}`); // Dynamic href
            newDiv.setAttribute('class', 'feature-post-item');
            newDiv.innerHTML = `
                <img src="${element.instaPhoto}" class="w-100" alt="">
            `;

            featurePostsContainer.appendChild(newDiv);
        });
    }
};

instaPosts()



// Three latest posts for single-post
let populationThree = document.getElementById('populationThree')
const singlePost = async () => {
    const { data, error } = await supabase
        .from('BLOGS')
        .select('id, created_at, Slug, blogImage, blogCategory, blogDate, blogContent')
        .order('created_at', { ascending: false })
        .limit(3);

    if (error) {
        console.error('Error fetching recent blogs:', error);
    } else {
        // console.log('Recent Blogs:', data);
        
        data.forEach(element => {


            // SLICING/TRUNCATING THE BLOG CONTENT
            const truncateContent = (content) => {
                const words = content.split(' ');
                const wordLimit = Math.ceil(words.length * 0.1);
                return `${words.slice(0, wordLimit).join(' ')}...`;
            };

            // POPULATING THE FRONTEND
            // let newDiv = document.createElement('div')
            let newDiv = document.createElement('a')
            newDiv.setAttribute('href', `single-post.html?slug=${element.Slug}`)
            newDiv.setAttribute('class', 'col-md-6 col-lg-4')
            newDiv.innerHTML = `
                <div class="card mb-5">
                    <div class="card-header p-0">
                        <div class="blog-media">
                            <img src="${element.blogImage}" alt="" class="w-100">
                            <a href="#" class="badge badge-primary">${element.blogCategory}</a>
                        </div>
                    </div>
                    <div class="card-body px-0">
                        <h6 class="card-title mb-2"><a href="#" class="text-dark">${truncateContent(element.blogContent)}</a></h6>
                        <small class="small text-muted">${element.blogDate}
                            <span class="px-2">-</span>
                        </small>
                    </div>
                </div>
            
            `
            populationThree.appendChild(newDiv)
        });



    }
};

singlePost()


// POPULATING THE LOADED/ALL BLOGS PAGE
let populationAll = document.getElementById('populationAll')
const loadedAll = async () => {
    const { data, error } = await supabase
        .from('BLOGS')
        .select('id, blogTitle, created_at, Slug, blogImage, blogCategory, blogDate, blogContent, blogAuthor')
        .order('created_at', { ascending: false })
        // .limit(7);

    if (error) {
        console.error('Error fetching recent blogs:', error);
    } else {
        // console.log('Recent Blogs:', data);
        
        data.forEach(element => {


            // SLICING/TRUNCATING THE BLOG CONTENT
            const truncateContent = (content) => {
                const words = content.split(' ');
                const wordLimit = Math.ceil(words.length * 0.1);
                return `${words.slice(0, wordLimit).join(' ')}...`;
            };

            // POPULATING THE FRONTEND
            let newDiv = document.createElement('div')
            newDiv.setAttribute('class', 'card')
            newDiv.innerHTML = `
            
               <div class="card-header text-center">
                        <h5 class="card-title">${element.blogTitle}</h5> 
                        <small class="small text-muted">${element.blogDate} 
                            <span class="px-2">-</span>
                        </small>
                </div>
                <div class="card-body">
                        <div class="blog-media">
                            <img src="${element.blogImage}" alt="" class="w-100">
                            <a href="#" class="badge badge-primary">${element.blogCategory}</a>     
                        </div>  
                        <p class="my-3">${truncateContent(element.blogContent)}</p>
                </div>
                    
                <div class="card-footer d-flex justify-content-between align-items-center flex-basis-0">
                        <button class="btn btn-primary circle-35 mr-4"><i class="ti-back-right"></i></button>
                        <a href="${window.location.origin}/single-post.html?slug=${element.Slug}" class="btn btn-outline-dark btn-sm">READ MORE</a>
                        <a href="#" class="text-dark small text-muted">By : ${element.blogAuthor}</a>
                </div>             
            
            `
            populationAll.appendChild(newDiv)
        });



    }
};

loadedAll()


