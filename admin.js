
// THE SUPABASE CONFIG.

// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = 'https://opjxgfjfjvcexhizvyar.supabase.co'
// const supabaseKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wanhnZmpmanZjZXhoaXp2eWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3ODMzMTUsImV4cCI6MjA0ODM1OTMxNX0.Vx5dbIopGNk2EU825CEPSVU5fIrlBp0d2yJi1fL_A80const 
// supabase = createClient(supabaseUrl, supabaseKey)

import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabaseUrl = 'https://opjxgfjfjvcexhizvyar.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wanhnZmpmanZjZXhoaXp2eWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3ODMzMTUsImV4cCI6MjA0ODM1OTMxNX0.Vx5dbIopGNk2EU825CEPSVU5fIrlBp0d2yJi1fL_A80';

const supabase = createClient(supabaseUrl, supabaseKey);


// console.log(supabase);

// const user = supabase.auth.user();
// if (!user) {
//   console.error('User is not authenticated');
// }



supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        // console.log('User signed in:', session.user);
    } else if (event === 'SIGNED_OUT') {
        window.location.href = 'signing.html';
    }
});




const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
        console.error('Error retrieving user session:', error);
        return null;
    }

    if (data.session) {
        const user = data.session.user;
        let userName = user.identities[0].identity_data.fullname
        let nameOut = document.getElementById('fullname')
        nameOut.textContent = userName
        // console.log('Current signed-in user:', user);
        return user; // Returns the current signed-in user's details
    } else {
        window.location.href = 'signing.html';
        return null;
    }
};

// Call the function
getCurrentUser();













// THE INPUTS
let blogTitleIn = document.getElementById('blogTitle')
let blogCategoryIn = document.getElementById('blogCategory')
let blogAuthorIn = document.getElementById('blogAuthor')
let blogContentIn = document.getElementById('blogContent')
let blogImageIn = document.getElementById('blogImage')

// THE BUTTONS
let writeBlogBtn = document.getElementById('writeBlog')
let readBlogBtn = document.getElementById('readBlog')
let updateBlogBtn = document.getElementById('updateBlog')
let deleteBlogBtn = document.getElementById('deleteBlog')




// WRITING TO THE DATABASE
const writeBlog = async () => {
    let blogTitle = blogTitleIn.value
    let blogAuthor = blogAuthorIn.value
    let blogContent = blogContentIn.value
    let blogCategory = blogCategoryIn.value

    // SLUGIFY THE TITLE
    function stringify(blogTitle){
        return blogTitle.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split('')
        .map(character => (/[a-z0-9]/.test(character) ? character : '-'))
        .join('')
        .replace(/-+/g, '-')
        .replace(/^- |- $/g, '')
    }

    const currentDate = new Date().toISOString().split("T")[0];

    if(blogTitle === '' || blogAuthor === '' || blogContent === '' || blogCategory === ''){
        alert('No field should be left empty')
        return
    }else{

        let file = blogImageIn.files[0]
        console.log(file)
        var fileName = file.name
        const filePath = `BLOG/${fileName}`
        const{data:uploadData, error:uploadError} = await supabase.storage
        .from('paean')
        .upload(filePath, file)
        if(uploadError){
            console.error('Upload Error: ', uploadError.message)
            return;
        }
        // console.log('File Successfully Uploaded:', uploadData);

        // GETTING BACK THE UPLOAD URL
        const {data:publicUrlData} = await supabase.storage
        .from('paean')
        .getPublicUrl(filePath)
        const fileUrl = publicUrlData.publicUrl
        // console.log('public url:', fileUrl);
        
        // SAVE THE DETAILS TO THE DATABASE
        const{data:dbData, error:dbError} = await supabase
        .from('BLOGS')
        .insert([
            {
                blogContent : blogContent,
                blogCategory : blogCategory,
                blogImage : fileUrl,
                blogTitle : blogTitle,
                blogAuthor : blogAuthor,
                Slug : stringify(blogTitle),
                blogDate : currentDate
            }
        ])
        if(dbError){
            alert('Database Error:', dbError)
        }else{
            alert('Post Successful:', dbData)
        }
        
    }
    blogTitleIn.value = ''
    blogAuthorIn.value = ''
    blogContentIn.value = ''
    blogCategoryIn.value = ''
}

writeBlogBtn.addEventListener('click', writeBlog)



// READING FROM THE DATABASE
const readBlog = async () => {
    let blogging = blogTitleIn.value
    const {data, error} = await supabase
    .from('BLOGS')
    .select()
    .eq('blogTitle', blogging)
    if(error){
        console.error(error)
    }else{
        console.log(data);
    }
}

readBlogBtn.addEventListener('click', readBlog)



// UPDATING THE BLOG
const updateBlog = async () => {
    let blogTitle = blogTitleIn.value
    let blogAuthor = blogAuthorIn.value
    let blogContent = blogContentIn.value
    let blogCategory = blogAuthorIn.value

        // SLUGIFY THE TITLE
        function stringify(blogTitle){
            return blogTitle.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .split('')
            .map(character => (/[a-z0-9]/.test(character) ? character : '-'))
            .join('')
            .replace(/-+/g, '-')
            .replace(/^- |- $/g, '')
        }

    if(blogTitle === '' || blogAuthor === '' || blogContent === '' || blogCategory === ''){
        alert('fill all empty spaces please')
    }else{
        const {data, error} = await supabase
        .from('BLOGS')
        .update([
            {
                blogContent : blogContent,
                blogCategory : blogCategory,
                blogTitle : blogTitle,
                blogAuthor : blogAuthor,
                Slug : stringify(blogTitle)
            }
        ])
        .eq('blogTitle', blogTitle)
        if(error){
            alert('Updating error:', error.message)
        }else{
            alert('Document Updated');
            
        }

    }
}

updateBlogBtn.addEventListener('click', updateBlog)

// DELETING THE BLOG

const deleteBlog = async () => {
    let blogTitle = blogTitleIn.value

    const{data, error} = await supabase
    .from('BLOGS')
    .delete()
    .eq('blogTitle', blogTitle)
    
    if(error){
        alert('Error Deleting:', error.message)
    }else{
        alert('Document Deleted')
        // console.log(data)
    }
}

deleteBlogBtn.addEventListener('click', deleteBlog)


let mainDisplay = document.getElementById('allContents')





// subscribing to realtime events

const channels = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'BLOGS' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

// https://x.com/OracleTechie/status/1863091199441039834?t=5uNBs6fHP6W-jy5DiUcwuQ&s=19











// FETCH AND DISPLAY ALL CONTENTS
const fetchAll = async () => {
    const {data, error} = await supabase
    .from('BLOGS')
    .select()
    if(error){
        console.error(error)
    }else{
        data.forEach(element => {
            // console.log(element)
            let blogImageFetched = element.blogImage
            let blogTitleFetched = element.blogTitle
            let slugFetched = element.Slug
            let blogContentFetched = element.blogContent
            let blogAuthorFetched = element.blogAuthor
            let blogDateFetched = element.blogDate
            let blogIdFetched = element.id


            let newDiv = document.createElement('div')
            newDiv.setAttribute('class', 'postedBlog')
            newDiv.innerHTML = `
                <div class="imgTab">
                    <img src="${blogImageFetched}" alt="avatar">
                </div>
                <div class="dateAndAuth">
                    <h3>${blogDateFetched}</h3>
                    <h3>${blogAuthorFetched}</h3>
                </div>

                <div class="others">
                    <h3>${blogTitleFetched}</h3>
                    <p>${blogContentFetched} </p>
                </div>
                <div class="comment">
                    <input type="text" id="commentName" placeholder="input name">
                    <textarea id="commenting" class="commenting" placeholder="Enter Comment"></textarea>
                     <button class="commentt" class="commentt">comment</button>
                </div>
                <button class="shareAcross">Share</button>
            `
            
            newDiv.querySelector('.commentt').addEventListener('click', async (event) => {
                const commentSection = event.target.closest('.comment')
                
                const mainCommentInput = commentSection.querySelector('.commenting');
                const commentNameInput = commentSection.querySelector('#commentName');
            
                const mainComment = mainCommentInput.value;
                const commentName = commentNameInput.value;
            
                // Ensure the values are passed correctly
                if (mainComment && commentName) {
                    const isSuccessful = await sendComment(mainComment, commentName, blogIdFetched);
            
                    if (isSuccessful) {
                        // Clear the fields after successful comment submission
                        mainCommentInput.value = '';
                        commentNameInput.value = '';
                    }
                } else {
                    console.error('Comment or Name is empty!');
                }
            })    
            newDiv.querySelector('.shareAcross').addEventListener('click', () => {
                // blogURL(slugFetched)
                blogURL(slugFetched, blogDateFetched, blogIdFetched)
            })    
            mainDisplay.appendChild(newDiv)
        });
        // console.log(data);
    }
}


//  SENDING COMMENT

    const sendComment = async(mainComment, commentName, blogIdFetched) => {
        const {data, error} = await supabase
        .from('COMMENTS')
        .insert([
            {
                commenterName : commentName,
                theComment : mainComment,
                blog_id : blogIdFetched
            }
        ])
        if(error){
            console.error(error)
            return false;
        }else{
            console.log('Comment made', data);
            return true;
        }
    }

    // http://127.0.0.1:5500/single-post.html?date=2024-12-01&id=11&slug=the-next-frontier-space-exploration-in-the-21st-century

    // Generating shareable link
    function blogURL(slugFetched, blogDateFetched, blogIdFetched){
        const redirectUrl = `${window.location.origin}/single-post.html?date=${blogDateFetched}&id=${blogIdFetched}&slug=${slugFetched}`
        navigator.clipboard.writeText(redirectUrl)
        .then(() => {
            alert('Blog link Copied')
        })
        .catch(error => {
            console.error(error)
        })
    }
    // function blogURL(slugFetched, blogDateFetched, blogIdFetched) {
    //     const redirectUrl = `${window.location.origin}/single-post.html/${blogDateFetched}/${blogIdFetched}/${slugFetched}`;
        
    //     navigator.clipboard.writeText(redirectUrl)
    //         .then(() => {
    //             alert('Blog link Copied');
    //         })
    //         .catch(error => {
    //             console.error(error);
    //         });
    // }
    

fetchAll()





// INSTAGRAM POSTS
let instaLinkIn = document.getElementById('instaLink')
let instaImage = document.getElementById('instaImage')
// BUTTONS
let writeInsta = document.getElementById('writeInsta')
let readInsta = document.getElementById('readInsta')
let updateInsta = document.getElementById('updateInsta')
let deleteInsta = document.getElementById('deleteInsta')



// INSTA WRITE
const writeInstaFunct = async () => {
    let instaLink = instaLinkIn.value


    const currentDate = new Date().toISOString().split("T")[0];

    if(instaLink === ''){
        alert('No field should be left empty')
        return
    }else{

        let file = instaImage.files[0]
        console.log(file)

        
        var fileName = file.name
        
        const filePath = `BLOG/${fileName}`
        const{data:uploadData, error:uploadError} = await supabase.storage
        .from('paean')
        .upload(filePath, file)
        if(uploadError){
            console.error('Upload Error: ', uploadError.message)
            return;
        }
        // console.log('File Successfully Uploaded:', uploadData);

        // GETTING BACK THE UPLOAD URL
        const {data:publicUrlData} = await supabase.storage
        .from('paean')
        .getPublicUrl(filePath)
        const fileUrl = publicUrlData.publicUrl
        // console.log('public url:', fileUrl);
        
        // SAVE THE DETAILS TO THE DATABASE
        const{data:dbData, error:dbError} = await supabase
        .from('INSTAGRAM')
        .insert([
            {
                instaLink : instaLink,
                instaPhoto : fileUrl,
            }
        ])
        if(dbError){
            alert('Database Error:', dbError.message)
        }else{
            alert('Post Successful:', dbData)
        }
        
    }
    instaLinkIn.value = ''
}

writeInsta.addEventListener('click', writeInstaFunct)



// READING THE INSTA POST
const readInstaFunct = async () => {
    let instaLink = instaLinkIn.value
    const {data, error} = await supabase
    .from('BLOGS')
    .select()
    .eq('instaLink', instaLink)
    if(error){
        console.error(error)
    }else{
        console.log(data);
    }
}

readInsta.addEventListener('click', readInstaFunct)



// UPDATING THE INSTA POST
const updateInstaFunct = async () => {
    let instaLink = instaLinkIn.value


    if(instaLink === ''){
        alert('fill all empty spaces please')
    }else{
        const {data, error} = await supabase
        .from('INSTAGRAM')
        .update([
            {
                instaLink : instaLink,
            }
        ])
        .eq('instaLink', instaLink)
        if(error){
            alert('Updating error:', error.message)
        }else{
            alert('Document Updated');
            
        }

    }
}

updateInsta.addEventListener('click', updateInstaFunct)

// DELETING THE INSTA POST

const deleteInstaFunct = async () => {
    let instaLink = instaLinkIn.value

    const{data, error} = await supabase
    .from('INSTAGRAM')
    .delete()
    .eq('instaLink', instaLink)
    
    if(error){
        alert('Error Deleting:', error.message)
    }else{
        alert('Document Deleted')
        // console.log(data)
    }
}

deleteInsta.addEventListener('click', deleteInstaFunct)
