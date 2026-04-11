import UploadWizard from "../components/UploadForm";

const UploadPage = ({isClose}) => {
  return (
    <div className="mt-0 p-4">
      <UploadWizard closeUploadPage={isClose}/>
    </div>
  );
};

export default UploadPage;
