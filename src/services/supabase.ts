import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_ANON || "")

export const uploadAvatarFile = async (file: any, name: string) => {
    try { 
      const { error } = await supabase.storage.from('avatar').upload(name, file.data)
      if (error) {
        console.error('Error uploading file:', error)
      } else {
        console.log('File uploaded successfully')
      }
    } catch (error) {
      console.error('Error in uploadAvatarFile:', error)
    }
}

export const getAvatarURL = async (name: string) => {  
  try {
    const {data, error} = await supabase.storage.from('avatar').createSignedUrl(name, 60)

    if (error) {
      console.error('Error downloading file:', error)
    } else {
      return data.signedUrl
    }
  } catch (error) {
    console.error('Error in getAvatarURL:', error)
  }
}
