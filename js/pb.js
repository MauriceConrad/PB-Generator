"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ProfilePicGenerator =
/*#__PURE__*/
function () {
  function ProfilePicGenerator(element) {
    _classCallCheck(this, ProfilePicGenerator);

    console.log(element);
    this.e = element;
    this.init();
  }

  _createClass(ProfilePicGenerator, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.e.classList.add("profile-picture");
      var hiddenInput = Object.assign(document.createElement("input"), {
        className: 'hidden-input',
        type: 'file',
        style: 'display: none'
      });
      document.body.append(hiddenInput);
      var picturePreview = Object.assign(document.createElement("div"), {
        className: 'profile-picture-preview'
      });
      this.picturePreview = picturePreview;
      this.previewImg = Object.assign(document.createElement("img"), {
        src: langDescriptor.template.preview
      });
      picturePreview.append(this.previewImg);
      this.loadingScreen = Object.assign(document.createElement("div"), {
        className: 'loading-screen'
      });
      this.loadingScreen.innerHTML = "\n      <div class=\"sk-circle\">\n        <div class=\"sk-circle1 sk-child\"></div>\n        <div class=\"sk-circle2 sk-child\"></div>\n        <div class=\"sk-circle3 sk-child\"></div>\n        <div class=\"sk-circle4 sk-child\"></div>\n        <div class=\"sk-circle5 sk-child\"></div>\n        <div class=\"sk-circle6 sk-child\"></div>\n        <div class=\"sk-circle7 sk-child\"></div>\n        <div class=\"sk-circle8 sk-child\"></div>\n        <div class=\"sk-circle9 sk-child\"></div>\n        <div class=\"sk-circle10 sk-child\"></div>\n        <div class=\"sk-circle11 sk-child\"></div>\n        <div class=\"sk-circle12 sk-child\"></div>\n      </div>\n    ";
      var btnGenerate = Object.assign(document.createElement("button"), {
        className: "btn-generate"
      });
      btnGenerate.append('Eigenes Profilbild generieren');
      btnGenerate.addEventListener("click", function () {
        var times = [];
        ProfilePicGenerator.openFile().then(function (file) {
          _this.openLoadScreen();

          times.push(Date.now());
          return new Promise(function (resolve, reject) {
            new ImageCompressor(file, {
              checkOrientation: true,
              maxWidth: 600,
              maxHeight: 600,
              minWidth: 0,
              minHeight: 0,
              width: undefined,
              height: undefined,
              quality: 0.7,
              beforeDraw: null,
              drew: null,
              success: function success(result) {
                console.log(result);
                var dataUrl = ProfilePicGenerator.blobToDataURL(result).then(function (dataUrl) {
                  resolve(dataUrl);
                });
              }
            });
          });
        }).then(function (dataUrl) {
          times.push(Date.now());
          console.log(dataUrl.length);
          return ProfilePicGenerator.render(dataUrl, _this.template);
        }).then(function (base64Str) {
          times.push(Date.now());
          console.log(times.map(function (time, index) {
            return times[index - 1] ? time - times[index - 1] : 0;
          }));
          _this.dataUrl = 'data:image/png;base64,' + base64Str;
          _this.previewImg.src = _this.dataUrl;

          _this.closeLoadScreen();
        });
      });
      var btnDownload = Object.assign(document.createElement("button"), {
        className: "btn-download"
      });
      btnDownload.append('Profilbild herunterladen');
      btnDownload.addEventListener("click", function () {
        ProfilePicGenerator.download(picturePreview.getElementsByTagName("img")[0].src, "Profile Picture", "image/png");
      });
      var msgDownload = Object.assign(document.createElement("span"), {
        className: 'msg-download',
        style: 'display: none;'
      });
      msgDownload.append('Gedrückt halten und auf "Bild sichern" tippen');

      if (ProfilePicGenerator.iOS) {
        msgDownload.style.display = 'block';
        btnDownload.style.display = 'none';
      }

      this.e.append(btnGenerate);
      this.e.append(picturePreview);
      this.e.append(this.loadingScreen);
      this.e.append(btnDownload);
      this.e.append(msgDownload);
    }
  }, {
    key: "openLoadScreen",
    value: function openLoadScreen() {
      this.loadingScreen.style.display = 'block';
      this.picturePreview.style.display = 'none';
    }
  }, {
    key: "closeLoadScreen",
    value: function closeLoadScreen() {
      this.picturePreview.style.display = 'block';
      this.loadingScreen.style.display = 'none';
    }
  }], [{
    key: "render",
    value: function render(dataUrl, template) {
      return new Promise(function (resolve, reject) {


        const body = {
          template: langDescriptor.template,
          doc: 0,
          data: Object.assign({
            "pic": {
              "data": dataUrl
            }
          }, langDescriptor.data)
        };
        console.log(body);

        var start = Date.now();
        fetch(ProfilePicGenerator.__apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }).then(function (res) {
          return res.arrayBuffer();
        }).then(function (arrayBuffer) {
          var end = Date.now();
          console.log(end - start);

          var base64 = ProfilePicGenerator._arrayBufferToBase64(arrayBuffer);

          resolve(base64);
        });
      });
    }
  }, {
    key: "openFile",
    value: function openFile() {
      return new Promise(function (resolve, reject) {
        var hiddenInput = document.getElementsByClassName("hidden-input")[0];
        hiddenInput.addEventListener("change", function (event) {
          console.log("!");
          var file = event.target.files[0];
          resolve(file);
        });
        hiddenInput.click();
      });
    }
  }, {
    key: "blobToDataURL",
    value: function blobToDataURL(blob) {
      return new Promise(function (resolve, reject) {
        var a = new FileReader();

        a.onload = function (e) {
          resolve(e.target.result);
        };

        a.readAsDataURL(blob);
      });
    }
  }, {
    key: "_arrayBufferToBase64",
    value: function _arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;

      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }

      return window.btoa(binary);
    }
  }, {
    key: "download",
    value: function download(data, strFileName, strMimeType) {
      var self = window,
          // this script is only for browsers anyway...
      u = "application/octet-stream",
          // this default mime also triggers iframe downloads
      m = strMimeType || u,
          x = data,
          D = document,
          a = D.createElement("a"),
          z = function z(a) {
        return String(a);
      },
          B = self.Blob || self.MozBlob || self.WebKitBlob || z,
          BB = self.MSBlobBuilder || self.WebKitBlobBuilder || self.BlobBuilder,
          fn = strFileName || "download",
          blob,
          b,
          ua,
          fr; //if(typeof B.bind === 'function' ){ B=B.bind(self); }


      if (String(this) === "true") {
        //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
        x = [x, m];
        m = x[0];
        x = x[1];
      } //go ahead and download dataURLs right away


      if (String(x).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/)) {
        return navigator.msSaveBlob ? // IE10 can't do a[download], only Blobs:
        navigator.msSaveBlob(d2b(x), fn) : saver(x); // everyone else can save dataURLs un-processed
      } //end if dataURL passed?


      try {
        blob = x instanceof B ? x : new B([x], {
          type: m
        });
      } catch (y) {
        if (BB) {
          b = new BB();
          b.append([x]);
          blob = b.getBlob(m); // the blob
        }
      }

      function d2b(u) {
        var p = u.split(/[:;,]/),
            t = p[1],
            dec = p[2] == "base64" ? atob : decodeURIComponent,
            bin = dec(p.pop()),
            mx = bin.length,
            i = 0,
            uia = new Uint8Array(mx);

        for (i; i < mx; ++i) {
          uia[i] = bin.charCodeAt(i);
        }

        return new B([uia], {
          type: t
        });
      }

      function saver(url, winMode) {
        if ('download' in a) {
          //html5 A[download]
          a.href = url;
          a.setAttribute("download", fn);
          a.innerHTML = "downloading...";
          D.body.appendChild(a);
          setTimeout(function () {
            a.click();
            D.body.removeChild(a);

            if (winMode === true) {
              setTimeout(function () {
                self.URL.revokeObjectURL(a.href);
              }, 250);
            }
          }, 66);
          return true;
        } //do iframe dataURL download (old ch+FF):


        var f = D.createElement("iframe");
        D.body.appendChild(f);

        if (!winMode) {
          // force a mime that will download:
          url = "data:" + url.replace(/^data:([\w\/\-\+]+)/, u);
        }

        f.src = url;
        setTimeout(function () {
          D.body.removeChild(f);
        }, 333);
      } //end saver


      if (navigator.msSaveBlob) {
        // IE10+ : (has Blob, but not a[download] or URL)
        return navigator.msSaveBlob(blob, fn);
      }

      if (self.URL) {
        // simple fast and modern way using Blob and URL:
        saver(self.URL.createObjectURL(blob), true);
      } else {
        // handle non-Blob()+non-URL browsers:
        if (typeof blob === "string" || blob.constructor === z) {
          try {
            return saver("data:" + m + ";base64," + self.btoa(blob));
          } catch (y) {
            return saver("data:" + m + "," + encodeURIComponent(blob));
          }
        } // Blob but not URL:


        fr = new FileReader();

        fr.onload = function (e) {
          saver(this.result);
        };

        fr.readAsDataURL(blob);
      }

      return true;
    }
  }, {
    key: "iOS",
    get: function get() {
      var iDevices = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'];

      if (!!navigator.platform) {
        while (iDevices.length) {
          if (navigator.platform === iDevices.pop()) {
            return true;
          }
        }
      }

      return false;
    }
  }]);

  return ProfilePicGenerator;
}();

ProfilePicGenerator.__apiEndpoint = 'https://api.fridaysforfuture.de/emulate';
ProfilePicGenerator.__templateUrl = 'https://dev.maurice-conrad.eu/toolpic/data/templates/profile/template.json';
ProfilePicGenerator.__languages = {
  th: {
    template: {
      "name": "Profile Picture",
      "root": "https://toolpic.fridaysforfuture.de/sharepic/templates/profile/template.json",
      "preview": "https://toolpic.fridaysforfuture.de/data/templates/profile/th/preview.jpg",
      "documents": [
        {
          "width": 1200,
          "height": 1200,
          "src": "data/templates/profile/th/document.svg",
          "alias": "1:1"
        }
      ],
      "fonts": [
        {
          "name": "Jost-600",
          "src": "fonts/Jost/Jost-600-Semi.ttf",
          "mime": "font/truetype"
        }
      ],
      "fields": [
        {
          "type": "Selection",
          "description": "Background",
          "key": "pic",
          "default": {
            "value": "data/templates/influence/bg.jpg"
          },
          "properties": {
            "items": [
              {
                "type": "file"
              }
            ]
          }
        },
        {
          "type": "Line",
          "description": "Hashtag",
          "key": "hashtag",
          "default": "#AllForClimate",
          "properties": {

          }
        }
      ]
    },
    data: {
      hashtag: '#Landtag4Climate'
    }
  },
  de: {
    template: {
      "name": "Profile Picture",
      "root": "https://toolpic.fridaysforfuture.de/sharepic/templates/profile/template.json",
      "preview": "https://toolpic.fridaysforfuture.de/data/templates/profile/de/preview.png",
      "documents": [
        {
          "width": 1200,
          "height": 1200,
          "src": "data/templates/profile/de/document.svg",
          "alias": "1:1"
        }
      ],
      "fonts": [
        {
          "name": "Jost-600",
          "src": "fonts/Jost/Jost-600-Semi.ttf",
          "mime": "font/truetype"
        },
        {
          "name": "Jost-700",
          "src": "fonts/Jost/Jost-700-Bold.ttf",
          "mime": "font/truetype"
        },
        {
          "name": "Jost-400",
          "src": "fonts/Jost/Jost-400-Book.ttf",
          "mime": "font/truetype"
        }
      ],
      "fields": [
        {
          "type": "Selection",
          "description": "Background",
          "key": "pic",
          "default": {
            "data": "data/templates/profile/fr/bg.jpg"
          },
          "properties": {
            "items": [
              {
                "type": "file"
              }
            ]
          }
        },
        {
          "type": "Line",
          "description": "Hashtag",
          "key": "hashtag",
          "default": "#NeustartKlima",
          "properties": {

          }
        }
      ]
    },
    data: {
      hashtag: '#NeustartKlima'
    }
  },
  en: '#AllForClimate',
  es: '#TodoPorElClima',
  fr: {
    template: {
      "name": "Profile Picture",
      "root": "https://toolpic.fridaysforfuture.de/sharepic/templates/profile/template.json",
      "preview": "https://toolpic.fridaysforfuture.de/data/templates/profile/fr/preview.jpg",
      "documents": [
        {
          "width": 1200,
          "height": 1200,
          "src": "data/templates/profile/fr/Logo_YFC_France.svg",
          "alias": "1:1"
        }
      ],
      "fonts": [
        {
          "name": "Gotham-Ultra",
          "src": "fonts/Gotham/Gotham Ultra.otf",
          "mime": "font/opentype"
        },
        {
          "name": "Gotham-Medium",
          "src": "fonts/Gotham/Gotham Medium.otf",
          "mime": "font/opentype"
        }
      ],
      "fields": [
        {
          "type": "Selection",
          "description": "Background",
          "key": "pic",
          "default": {
            "data": "data/templates/influence/bg.jpg"
          },
          "properties": {
            "items": [
              {
                "type": "file"
              }
            ]
          }
        }
      ]
    },
    data: {}
  },
  la: '#OmnesEnimCaeli'
};



var langCode = (window.location.hash || '#de').substring(1);
var langDescriptor = ProfilePicGenerator.__languages[langCode];
