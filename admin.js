
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


console.log(supabase);


// THE INPUTS
let blogTitleIn = document.getElementById('blogTitle')
let blogAuthorIn = document.getElementById('blogAuthor')
let blogContentIn = document.getElementById('blogContent')
let blogImageIn = document.getElementById('blogImage')

// THE BUTTONS
let writeBlog = document.getElementById('writeBlog')
let readBlog = document.getElementById('readBlog')
let updateBlog = document.getElementById('updateBlog')
let deleteBlog = document.getElementById('deleteBlog')




// WRITING TO THE DATABASE
const writeBlogFunct = async () => {
    let blogTitle = blogTitleIn.value
    let blogAuthor = blogAuthorIn.value
    let blogContent = blogContentIn.value

    if(blogTitle === '' || blogAuthor === '' || blogContent === ''){
        alert('No field should be left empty')
        return
    }else{

        let file = blogImageIn.files[0]
        var fileName = file.name
        const filePath = `BLOG/${fileName}`
        const{data:uploadData, error:uploadError} = await supabase.storage
        .from('Paean')
        .upload(filePath, file)
        if(uploadError){
            console.error('Upload Error: ', uploadError)
            return;
        }
        console.log('File Successfully Uploaded:', uploadData);

        // GETTING BACK THE UPLOAD URL
        const {data:publicUrlData} = await supabase.storage
        .from('Paean')
        .getPublicUrl(filePath)
        const fileUrl = publicUrlData.publicUrl
        console.log('public url:', fileUrl);
        
        // SAVE THE DETAILS TO THE DATABASE
        const{data:dbData, error:dbError} = await supabase
        .from('PAEAN')
        .insert([
            {
                blogContent : blogContent,
                blogImage : fileUrl,
                blogTitle : blogTitle,
                blogAuthor : blogAuthor,
                Slug : blogSlug
            }
        ])
        if(dbError){
            console.error('Database Error:', dbError)
        }else{
            console.log('Post Successful:', dbData)
        }
        
    }
}

writeBlog.addEventListener('click', writeBlogFunct)