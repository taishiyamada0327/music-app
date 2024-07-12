export function Pagination(props) {
  return (
    <div className="mt-8 flex justify-center">
      <button
        hidden={props.moveToPrev === null}
        onClick={props.moveToPrev}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed mr-4"
      >
        Previous
      </button>
      <p className="py-2">{props.currentPage}</p>
      <button
        hidden={props.moveToNext === null}
        onClick={props.moveToNext}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed ml-4"
      >
        Next
      </button>
    </div>
  );
}
