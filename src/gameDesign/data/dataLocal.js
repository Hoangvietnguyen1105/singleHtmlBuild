import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Debug } from "../../template/debug";

export const DataLocalEvent = Object.freeze({
  Initialize: "initialize",
});

export const DataLocalState = Object.freeze({
  Loaded: "loaded",
  Loading: "loading",
  Unloaded: "unloaded",
});

export class DataLocal {
  static init() {
    // Kiểm tra xem trình duyệt có hỗ trợ IndexedDB không
    if (!window.indexedDB) {
      Debug.log("Trình duyệt của bạn không hỗ trợ phiên bản ổn định của IndexedDB. Một số tính năng cụ thể có thể không khả dụng.");
      return;
    }

    // Thiết lập trạng thái ban đầu của DataLocal là "Chưa tải"
    this.state = DataLocalState.Unloaded;

    // Thiết lập tên cơ sở dữ liệu và phiên bản
    this.dbName = GameConstant.INDEXEDDB_NAME;
    this.dbVersion = GameConstant.INDEXEDDB_VERSION;

    // Khởi tạo biến cơ sở dữ liệu là null
    this.db = null;

    // Khởi tạo biến để theo dõi tổng số lần tải dữ liệu và tổng số dữ liệu cần tải
    this.totalLoad = 0;
    this.totalData = 3;

    // Mở kết nối tới cơ sở dữ liệu IndexedDB
    var request = window.indexedDB.open(this.dbName, this.dbVersion);

    // Xử lý sự kiện khi phiên bản cơ sở dữ liệu được nâng cấp
    request.onupgradeneeded = (event) => {
      this.db = event.target.result;

      // Kiểm tra xem cơ sở dữ liệu đã có cửa hàng dữ liệu chưa, nếu chưa thì tạo mới
      if (!this.db.objectStoreNames.contains(GameConstant.INDEXEDDB_STORE_NAME)) {
        this.db.createObjectStore(GameConstant.INDEXEDDB_STORE_NAME);
      }
    }

    // Thiết lập trạng thái là "Đang tải"
    this.state = DataLocalState.Loading;

    // Xử lý sự kiện khi kết nối tới cơ sở dữ liệu IndexedDB thành công
    request.onsuccess = (event) => {
      this.db = event.target.result;

      // Tải dữ liệu từ cơ sở dữ liệu
      this.getCurrency();
      this.getCurrentLevel();
      //  this.getStartNumber();
      this.getUserIncome();
    }

    // Xử lý sự kiện khi có lỗi xảy ra
    request.onerror = (event) => {
      Debug.error("Lỗi: ", event);
    }
  }


  static checkLoad() {
    this.totalLoad++;
    if (this.totalLoad === this.totalData) {
      this.state = DataLocalState.Loaded;
      Game.app.fire(DataLocalEvent.Initialize);
    }
  }

  static getCurrentLevel() {
    this.getData(GameConstant.INDEXEDDB_CURRENT_LEVEL_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.currentLevel = 1;
        this.addData(GameConstant.INDEXEDDB_CURRENT_LEVEL_KEY, this.currentLevel);
      } else {
        this.currentLevel = 6

      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }
  static getCurrency() {
    // Gọi hàm getData() để lấy dữ liệu tiền tệ từ cơ sở dữ liệu
    this.getData(GameConstant.INDEXEDDB_CURRENCY_KEY).then((value) => {
      // Kiểm tra nếu giá trị là không xác định (undefined)
      if (typeof (value) === "undefined") {
        // Thiết lập giá trị tiền tệ mặc định là 0 và thêm vào cơ sở dữ liệu
        this.currency = 0;
        this.addData(GameConstant.INDEXEDDB_CURRENCY_KEY, this.currency);
      } else {
        // Nếu có giá trị, gán giá trị tiền tệ từ cơ sở dữ liệu
        this.currency = value;
      }

      // Kiểm tra và đánh dấu rằng dữ liệu đã được tải xong
      this.checkLoad();
    }).catch((error) => {
      // Xử lý lỗi nếu có
      console.error(error);
    });
  }


  // static getStartNumber() {
  //   this.getData(GameConstant.INDEXEDDB_START_NUMBER_KEY).then((value) => {
  //     if (typeof (value) === "undefined") {
  //       this.startNumber = GameConstant.PLAYER_START_NUMBER;
  //       this.addData(GameConstant.INDEXEDDB_START_NUMBER_KEY, this.startNumber);
  //     } else {
  //       this.startNumber = value;
  //     }
  //     this.checkLoad();
  //   }).catch((error) => {
  //     console.error(error);
  //   });
  // }

  static getUserIncome() {
    this.getData(GameConstant.INDEXEDDB_INCOME_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.userIncomeValue = GameConstant.PLAYER_START_INCOME;
        this.addData(GameConstant.INDEXEDDB_INCOME_KEY, this.userIncomeValue);
      } else {
        this.userIncomeValue = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static addData(key, value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.add(value, key);
    request.onsuccess = () => {
      Debug.log("add success", key);
    }
    request.onerror = (err) => {
      Debug.error("add error", err);
    }
  }

  static getData(key) {
    return new Promise((resolve, reject) => {
      const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
      let request = userData.get(key);
      request.onsuccess = (event) => {
        resolve(event.target.result);
      }
      request.onerror = (event) => {
        reject(event);
      }
    });
  }

  static updateCurrentLevelData(value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(GameConstant.INDEXEDDB_CURRENT_LEVEL_KEY);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value;
      this.currentLevel = data;
      var requestUpdate = userData.put(data, GameConstant.INDEXEDDB_CURRENT_LEVEL_KEY);
      requestUpdate.onsuccess = () => {
        Debug.log("update success");
      }
      requestUpdate.onerror = (err) => {
        Debug.error("update error", err);
      }
    }
    request.onerror = (event) => {
      Debug.error("error: ", event);
    }
  }

  static updateDataByKey(key, value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(key);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = parseFloat(value.toFixed(1));
      var requestUpdate = userData.put(data, key);
      requestUpdate.onsuccess = () => {
        Debug.log("update " + key + " success");
      }
      requestUpdate.onerror = (err) => {
        Debug.error("update " + key + " error", err);
      }
    }
    request.onerror = (event) => {
      Debug.error("error: ", event);
    }
  }
}