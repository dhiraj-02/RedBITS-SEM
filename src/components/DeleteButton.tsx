'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/Icons'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'

interface DeleteButtonProps {
  subreddit: string
  postId: string
  commentId: string
  subredditId: string
}

const DeleteButton = ({ subreddit, postId, commentId, subredditId}: DeleteButtonProps) => {
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false) // State to track modal visibility
  const [isClient, setIsClient] = useState(false) // State to track if component is mounted on client

  // Ensure the modal only renders on the client
  useEffect(() => {
    setIsClient(true) // Set state to true once the component mounts on the client
  }, [])

  const handleOpenModal = () => {
    setIsModalOpen(true) // Open the modal
  }

  const handleCloseModal = () => {
    setIsModalOpen(false) // Close the modal
  }

  const handleDelete = async () => {
    if(postId){
      try{
        const deleted = await axios.delete(`/api/posts`, { params: { id: postId } });
        if(deleted.status == 200){
          toast({
            title: 'Deleted!',
            description: `Post deleted successfully!`,
          })
          window.location.href = `/r/${subreddit}`
        } else {
          toast({
            title: 'Failed!',
            description: `Failed to delete post at the moment`,
            variant: 'destructive'
          })
        }
      } catch (err){
        toast({
          title: 'Failed!',
          description: `Failed to delete post at the moment`,
          variant: 'destructive'
        })
      }
      handleCloseModal()
    }
    else if(commentId){
      try{
        const deleted = await axios.delete(`/api/comments`, { params: { id: commentId } });
        if(deleted.status == 200){
          toast({
            title: 'Deleted!',
            description: `Comment deleted successfully!`,
          })
          window.location.reload()
        } else {
          toast({
            title: 'Failed!',
            description: `Failed to delete comment at the moment`,
            variant: 'destructive'
          })
        }
      } catch (err){
        toast({
          title: 'Failed!',
          description: `Failed to delete comment at the moment`,
          variant: 'destructive'
        })
      }
      handleCloseModal()
    }
    else if(subredditId){
      try{
        const deleted = await axios.delete(`/api/subreddit`, { params: { id: subredditId } });
        if(deleted.status == 200){
          toast({
            title: 'Deleted!',
            description: `Community deleted successfully!`,
          })
          window.location.href = `/`
        } else {
          toast({
            title: 'Failed!',
            description: `Failed to delete community at the moment`,
            variant: 'destructive'
          })
        }
      } catch (err){
        toast({
          title: 'Failed!',
          description: `Failed to delete community at the moment`,
          variant: 'destructive'
        })
      }
      handleCloseModal()
    }
  }

  if (!isClient) {
    return null // Render nothing on the server side
  }

  let item: string = ''
  if(commentId) item = 'comment'
  else if(postId) item = 'post'
  else if(subredditId) item = 'community'

  return (
    <>
      {/* Delete Button */}
      <button className="p-2 rounded hover:bg-red-100" onClick={handleOpenModal}>
        <Icons.delete className="h-6 w-6 sm:h-5 sm:w-5 text-red-600 hover:text-red-800" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg text-gray font-bold mb-4">Are you sure you want to delete this <br></br>{item}?</h3>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                onClick={handleCloseModal} // Close without doing anything
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleDelete} // Proceed with the deletion
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DeleteButton
