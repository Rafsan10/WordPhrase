var key_inp = document.getElementById("word_input");
var input_keys = document.getElementById("input_keys");
var phrases = document.getElementById("phrases");

var raw_key = [];
var words = {};
var phrase = {};
var others = [];
var values = [];
var limits = {
  title: 61,
  brand: 51,
  bullet1: 255,
  bullet2: 255,
  description: 255,
};

var title, brand, bullet1, bullet2, description;

title = document.getElementById("title");
brand = document.getElementById("brand");
bullet1 = document.getElementById("bullet1");
bullet2 = document.getElementById("bullet2");
description = document.getElementById("description");

var input_shortener = [title, brand, bullet1, bullet2, description];

key_inp.addEventListener("keypress", function (e) {
  //check enter key
  if (e.key == "Enter") {
    var raw_str = refine(key_inp.value).toLowerCase();
    key_inp.value = "";
    raw_arr = raw_str.split(",");
    for (let i = 0; i < raw_arr.length; i++) {
      if (refine(raw_arr[i]).split(" ").length > 1) {
        phrase[refine(raw_arr[i])] = 0;
      }
      var tem_words = refine(raw_arr[i]).split(" ");
      for (let j = 0; j < tem_words.length; j++) {
        words[refine_word(tem_words[j])] = 0;
      }
    }
    combined_input = combine_value();
    recheck(combined_input);
    populate();
  }
});

// str refine space remover
const refine = (str) => {
  var temp_str = str.split(" ");
  var refined_str = temp_str.filter(function (item) {
    return item != "";
  });
  return refined_str.join(" ").toLowerCase();
};

// word cleanier , ? . ! remover
const refine_word = (word) => {
  return word.replace(/[.!?]/g, "");
};

// copy
var all_copy = document.getElementsByClassName("copybtn");

for (let i = 0; i < all_copy.length; i++) {
  all_copy[i].addEventListener("click", function (e) {
    e.path[0].innerText = "Copied";
    e.path[0].classList.add("copied");
    setTimeout(function () {
      e.path[0].innerText = "Copy 📋";
      e.path[0].classList.remove("copied");
    }, 500);
    var text = e.path[4].childNodes[3].value.toLowerCase();
    navigator.clipboard.writeText(refine(text)).then(
      function () {
        e.path[4].childNodes[3];
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  });
}

// input listener event
const input_listener = () => {
  input_shortener.forEach((cur_field) => {
    cur_field.children[1].addEventListener("input", function (e) {
      var limit =
        e.path[1].children[0].children[1].children[0].children[2].innerText;
      limit = limit.slice(1, limit.length);
      var cur_char = e.path[0].value.length;
      var char_left = limit - cur_char;
      var char_left_indicator =
        e.path[1].children[0].children[1].children[0].children[1];
      char_left_indicator.innerText = char_left;
      if (char_left <= 0) {
        e.path[0].value = e.path[0].value.slice(0, limit);
        char_left_indicator.innerText = 0;
      }
      combined_input = combine_value();
      recheck(combined_input);
      populate();
    });
  });
};
input_listener();

// combine all value on all inputs
const combine_value = () => {
  var combined_input = "";
  input_shortener.forEach((item) => {
    combined_input += "@#@#@#" + item.children[1].value.toLowerCase();
  });
  return combined_input;
};

// checking mathched keyword and phrashe
const recheck = (combined_input) => {
  combined_input = refine(combined_input);
  // check if mathched word
  var for_word = combined_input.split("@#@#@#").join(" ").split(" ");

  for_word = for_word.map((item) => {
    return refine_word(item);
  });
  for (const word in words) {
    if (for_word.includes(word)) {
      words[word] = 1;
    } else {
      words[word] = 0;
    }
  }

  // check if mathced phrase
  var for_phrase = " " + combined_input.toLowerCase() + " ";
  for (const item in phrase) {
    if (for_phrase.includes(item.toLowerCase())) {
      var tem_index = for_phrase.indexOf(item.toLowerCase());
      if (
        !(
          isLetter(for_phrase[tem_index - 1]) ||
          isLetter(for_phrase[tem_index + item.length])
        )
      ) {
        phrase[item.toLowerCase()] = 1;
        console.log(
          isLetter(for_phrase[tem_index - 1]),
          isLetter(for_phrase[tem_index + item.length])
        );
      } else {
        phrase[item.toLowerCase()] = 0;
      }
    } else {
      phrase[item.toLowerCase()] = 0;
    }
  }
};

// check if letter
function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

// // remove item

const closeLister = (children) => {
  var cur_item = [...children][children.length - 1];
  cur_item = cur_item.children[0];
  cur_item.addEventListener("click", function (e) {
    cur_item.parentNode.classList.add("animate");
  });

  cur_item.addEventListener("click", function (e) {
    setTimeout(function () {
      var remove_index = [...e.path[2].children].indexOf(e.path[1]);
      var remove_type = e.path[2].id;
      if (remove_type == "phrases") {
        var removed_item = Object.keys(phrase)[remove_index];
        delete phrase[removed_item];
      } else {
        var removed_item = Object.keys(words)[remove_index];
        delete words[removed_item];
      }
      recheck(combine_value());
      populate();
    }, 300);
  });
};

// populate the words and phrase
const populate = () => {
  recheck(combine_value());
  input_keys.innerHTML = "";
  //adding to word div
  for (const word in words) {
    var word_span = document.createElement("span");
    word_span.classList.add("key");
    if (words[word]) {
      word_span.classList.add("present");
    } else {
      word_span.classList.remove("present");
    }
    word_span.innerHTML = word + "<span class='close'>x</span>";
    input_keys.appendChild(word_span);
    closeLister(input_keys.children);
  }

  // adding to phrase
  phrases.innerHTML = "";
  for (const item in phrase) {
    var key_el = document.createElement("span");
    key_el.classList.add("phrase");
    if (phrase[item]) {
      key_el.classList.add("present");
    } else {
      key_el.classList.remove("present");
    }
    key_el.innerHTML = item + "<span class='close'>x</span>";
    phrases.appendChild(key_el);
    closeLister(phrases.children);
  }
};
