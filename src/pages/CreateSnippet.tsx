import { useNavigate } from 'react-router-dom';
import { CreateSnippetForm } from '../components/CreateSnippetForm';

function CreateSnippet() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-dark-100 mb-6">Create New Snippet</h1>
      <div className="bg-dark-800 rounded-lg border border-dark-700 shadow-xl p-6">
        <CreateSnippetForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default CreateSnippet; 