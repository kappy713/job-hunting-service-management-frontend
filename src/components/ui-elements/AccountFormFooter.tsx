type AccountFormFooterProps = {
  text: string;
  icon: React.ReactNode;
  secondaryText: string;
  onClick: () => void;
  disabled: boolean;
};

const AccountFormFooter = ({
  text,
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
        className="bg-[#00005d] hover:bg-blue-900 text-white  py-2 px-3 rounded-lg flex items-center gap-1 transition-colors disabled:bg-gray-400"
      >
        <span>{text}</span>
      </button>
    </div>
  );
};

export default AccountFormFooter;
