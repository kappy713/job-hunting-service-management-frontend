type AccountFormFooterProps = {
  text: string;
  icon: React.ReactNode;
  secondaryText: string;
  onClick: () => void;
  disabled: boolean;
};

const AccountFormFooter = ({
  text,
  icon,
  secondaryText,
  onClick,
  disabled,
}: AccountFormFooterProps) => {
  return (
    <div className="flex items-center justify-between">
      <p
        onClick={onClick}
        className="text-sm text-blue-600 hover:underline cursor-pointer px-4"
      >
        {secondaryText}
      </p>
      <button
        type="submit"
        disabled={disabled}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-1 transition-colors disabled:bg-gray-400"
      >
        <span>{text}</span>
        {icon}
      </button>
    </div>
  );
};

export default AccountFormFooter;
