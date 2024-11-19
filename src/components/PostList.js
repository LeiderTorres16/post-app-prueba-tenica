
import React, { useEffect, useState } from "react";
import axios from "axios";
import PostForm from "./PostForm";
import Modal from "./Modal";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = async (newPost) => {
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        newPost
      );
      setPosts((prevPosts) => [response.data, ...prevPosts]);
      setIsCreating(false);
    } catch (error) {
      console.error("Error creando el post:", error);
    }
  };

  const handleEditPost = async (updatedPost) => {
    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/posts/${editingPost.id}`,
        updatedPost
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === editingPost.id ? response.data : post
        )
      );
      setEditingPost(null);
    } catch (error) {
      console.error("Error editando el post:", error);
    }
  };

  const handleDeletePost = async (id) => {
    setModalData({
      title: "Eliminar Post",
      message: "¿Estás seguro de que deseas eliminar este post?",
      onConfirm: async () => {
        try {
          await axios.delete(
            `https://jsonplaceholder.typicode.com/posts/${id}`
          );
          setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
          setIsModalOpen(false);
        } catch (error) {
          console.error("Error eliminando el post:", error);
        }
      },
    });
    setIsModalOpen(true);
  };

  return (
    <div className="overflow-x-auto">
      <button
        onClick={() => setIsCreating(true)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Crear Post
      </button>
      {isCreating && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Crear Nuevo Post</h2>
          <PostForm
            onSubmit={handleCreatePost}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}

      {editingPost && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Editar Post</h2>
          <PostForm
            initialData={editingPost}
            onSubmit={handleEditPost}
            onCancel={() => setEditingPost(null)}
          />
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-4 border-b">ID</th>
            <th className="text-left p-4 border-b">Título</th>
            <th className="text-left p-4 border-b"></th>
            <th className="text-left p-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50">
              <td className="p-4 border-b">{post.id}</td>
              <td className="p-4 border-b">{post.title}</td>
              <td className="p-4 border-b">
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
              <td className="p-4 border-b">
                <button
                  onClick={() => setEditingPost(post)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex flex-col items-center mt-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(posts.length / postsPerPage))
              )
            }
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
          >
            Siguiente
          </button>
        </div>
        <p className="text-center mt-2">
          Página {currentPage} de {Math.ceil(posts.length / postsPerPage)}
        </p>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={modalData.title}
        message={modalData.message}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalData.onConfirm}
      />
    </div>
  );
}
