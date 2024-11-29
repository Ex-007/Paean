
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


// THE INPUTS
let blogTitleIn = document.getElementById('blogTitle')
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

    if(blogTitle === '' || blogAuthor === '' || blogContent === ''){
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
        console.log('File Successfully Uploaded:', uploadData);

        // GETTING BACK THE UPLOAD URL
        const {data:publicUrlData} = await supabase.storage
        .from('paean')
        .getPublicUrl(filePath)
        const fileUrl = publicUrlData.publicUrl
        console.log('public url:', fileUrl);
        
        // SAVE THE DETAILS TO THE DATABASE
        const{data:dbData, error:dbError} = await supabase
        .from('Paean')
        .insert([
            {
                blogContent : blogContent,
                blogImage : fileUrl,
                blogTitle : blogTitle,
                blogAuthor : blogAuthor,
                Slug : stringify(blogTitle)
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
}

writeBlogBtn.addEventListener('click', writeBlog)



// READING FROM THE DATABASE
const readBlog = async () => {
    let blogging = blogTitleIn.value
    const {data, error} = await supabase
    .from('Paean')
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

    if(blogTitle === '' || blogAuthor === '' || blogContent === ''){
        alert('fill all empty spaces please')
    }else{
        const {data, error} = await supabase
        .from('Paean')
        .update([
            {
                blogContent : blogContent,
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
    .from('Paean')
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
// FETCH AND DISPLAY ALL CONTENTS
const fetchAll = async () => {
    const {data, error} = await supabase
    .from('Paean')
    .select()
    if(error){
        console.error(error)
    }else{
        data.forEach(element => {
            let blogImageFetched = element.blogImage
            let blogTitleFetched = element.blogTitle
            let slugFetched = element.Slug
            let blogContentFetched = element.blogContent
            let blogAuthorFetched = element.blogAuthor
            // let blogDateFetched = element.blogDate


            let newDiv = document.createElement('div')
            newDiv.setAttribute('class', 'postedBlog')
            newDiv.innerHTML = `
                <div class="imgTab">
                    <img src="${blogImageFetched}" alt="avatar">
                </div>
                <div class="others">
                    <h3>14th November, 2024</h3>
                    <h3>${blogAuthorFetched}</h3>
                    <h3>${blogTitleFetched}</h3>
                    <p>${blogContentFetched} </p>
                </div>
                <button>Share</button>
            `
            mainDisplay.appendChild(newDiv)
            // console.log(element);
            
        });
        // console.log(data);
    }
}

fetchAll()


https://opjxgfjfjvcexhizvyar.supabase.co/storage/v1/object/public/paean/BLOG/avatar-1.jpg
"https://opjxgfjfjvcexhizvyar.supabase.co/storage/v1/object/public/Paean/BLOG/avatar-3.jpg"