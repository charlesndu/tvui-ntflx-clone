/**
 * Render browse page
 */
export const renderBrowse = (data) => {
  buildGrid(data.rows);
  startNav_browsePage(data);
};

/**
 * Render details page
 */
export const renderDetails = (id, title) => {
  startNav_detailPage(id, title);
};

/**
 * Utility method - map video ids
 */
const parse_data = (data) => {
  const json_data = {};
  if (!data || !data.videos) return json_data;

  data.videos.forEach((video) => {
    json_data[video.videoId] = {
      title: video.title,
    };
  });
  return json_data;
};

/**
 * Set focused title details - Shared method
 */
const setDetails = (id, title) => {
  document.getElementById("titleText").innerHTML = title;
  document.getElementById(
    "videoDisplayArt"
  ).style.backgroundImage = `url('./images/displayart/${id}.jpg')`;
};

const startNav_browsePage = (data) => {
  // Map video ids
  const json_data = parse_data(data);

  // Init values
  let focusRow = 0;
  let focusIndex = 0;
  const rows = [];

  /**
   * Set focus targets - Populate rows array with each row's poster element
   */
  data.rows.forEach((row, i) => {
    rows.push(document.querySelectorAll(`.videoList#list${i + 1} .video`));
  });

  // Set initial focus
  rows[focusRow][focusIndex].focus();
  setDetails(
    rows[focusRow][focusIndex].id,
    json_data[rows[focusRow][focusIndex].id].title
  );

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        /**
         * Up arrow keypress - Move focus to row above
         * Wrap focus on the first row
         */
        focusRow = focusRow - 1;
        if (focusRow < 0) focusRow = rows.length - 1;
        rows[focusRow][focusIndex].focus();
        setDetails(
          rows[focusRow][focusIndex].id,
          json_data[rows[focusRow][focusIndex].id].title
        );
        break;
      case "ArrowDown":
        /**
         * Down arrow keypress - Move focus to the next row
         * Wrap focus on the last row
         */
        focusRow = (focusRow + 1) % rows.length;
        rows[focusRow][focusIndex].focus();
        setDetails(
          rows[focusRow][focusIndex].id,
          json_data[rows[focusRow][focusIndex].id].title
        );
        break;
      case "ArrowRight":
        /**
         * Right arrow keypress - Move focus to the right column
         * Wrap focus at the end of the row
         */
        focusIndex = (focusIndex + 1) % rows[focusRow].length;
        rows[focusRow][focusIndex].focus();
        setDetails(
          rows[focusRow][focusIndex].id,
          json_data[rows[focusRow][focusIndex].id].title
        );
        break;
      case "ArrowLeft":
        /**
         * Left arrow keypress - Move focus to left column
         * If focused on first tile, wrap focus to last
         */
        focusIndex = focusIndex - 1;
        if (focusIndex < 0) focusIndex = rows[focusRow].length - 1;
        rows[focusRow][focusIndex].focus();
        setDetails(
          rows[focusRow][focusIndex].id,
          json_data[rows[focusRow][focusIndex].id].title
        );
        break;
      case "Enter":
        /**
         * Enter keypress - Load details page for focused asset
         */
        window.location.href = `/details?id=${
          rows[focusRow][focusIndex].id
        }&title=${json_data[rows[focusRow][focusIndex].id].title}`;
        break;
    }
  });
};

const startNav_detailPage = (id, title) => {
  const buttons = document.querySelectorAll("#navigation .button");
  let focusIndex = 0;

  // Set initial button focus
  buttons[focusIndex].focus();

  // Set title details
  setDetails(id, title);

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        focusIndex = (focusIndex - 1) % buttons.length;
        if (focusIndex < 0) focusIndex = buttons.length - 1;
        buttons[focusIndex].focus();
        break;
      case "ArrowDown":
        focusIndex = (focusIndex + 1) % buttons.length;
        buttons[focusIndex].focus();
        break;
      case "Enter":
        if (buttons[focusIndex].id === "back") {
          history.back();
        }
        switch (buttons[focusIndex].id) {
          case "play":
          case "rate":
          case "episodes":
            alert(`${buttons[focusIndex].innerHTML} - ${title}`);
            break;
        }
        break;
      case "Backspace":
        history.back();
        break;
    }
  });
};

/**
 * Create application rows
 * @param {Array<Object>} rows
 */
const buildGrid = (rows) => {
  if (!rows || !rows.length) return;

  const container = document.getElementById("videoListRows");

  rows.forEach((obj, index) => {
    // Row
    const row = document.createElement("div");
    row.className = "listRow";

    const rowTitle = document.createElement("div");
    rowTitle.innerHTML = obj.rowTitle;
    rowTitle.className = "rowTitle";
    row.appendChild(rowTitle);

    const videoList = document.createElement("div");
    videoList.id = `list${index + 1}`;
    videoList.className = "videoList";

    obj.videoList.forEach((video_id, i) => {
      const poster = document.createElement("img");
      poster.id = video_id;
      poster.className = "video";
      poster.tabIndex = "1";
      poster.src = `./images/boxart/${video_id}.jpg`;
      videoList.appendChild(poster);
    });

    row.appendChild(videoList);
    container.appendChild(row);
  });
};

export const getTitleInfo = () => {
  const params = new URLSearchParams(window.location.search);
  return { id: params.get("id"), title: params.get("title") };
};
