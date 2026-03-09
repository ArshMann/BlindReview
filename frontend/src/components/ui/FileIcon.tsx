interface FileIconProps {
  fileName: string;
  type?: string;
  className?: string;
}

const ICONS = {
  pdf: '\u{1F4C4}',
  doc: '\u{1F4DD}',
  docx: '\u{1F4DD}',
  txt: '\u{1F4C3}',
  png: '\u{1F5BC}\uFE0F',
  jpg: '\u{1F5BC}\uFE0F',
  jpeg: '\u{1F5BC}\uFE0F',
  default: '\u{1F4C1}',
};

const getExtension = (fileName: string, type?: string) => {
  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  if (fileExtension) {
    return fileExtension;
  }

  return type?.toLowerCase() ?? '';
};

export default function FileIcon({ fileName, type, className = 'br-file-icon' }: FileIconProps) {
  const extension = getExtension(fileName, type);

  const icon = ICONS[extension as keyof typeof ICONS] ?? ICONS.default;

  return (
    <span role="img" aria-label={`${extension || 'file'} icon`} className={className}>
      {icon}
    </span>
  );
}
