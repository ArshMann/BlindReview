import FileIcon from './FileIcon';

interface SubmissionRowProps {
  fileName: string;
  type?: string;
  createdAt: string;
  onView: () => void;
}

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export default function SubmissionRow({ fileName, type, createdAt, onView }: SubmissionRowProps) {
  return (
    <article className="br-submission-row">
      <div className="br-submission-file">
        <span className="br-file-icon-wrap">
          <FileIcon fileName={fileName} type={type} />
        </span>

        <p className="br-submission-name" title={fileName}>
          {fileName}
        </p>
      </div>

      <time className="br-submission-date" dateTime={createdAt}>
        {formatDate(createdAt)}
      </time>

      <div className="br-submission-action">
        <button type="button" className="br-view-btn" onClick={onView}>
          View
        </button>
      </div>
    </article>
  );
}
