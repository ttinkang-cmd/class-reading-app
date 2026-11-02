// ========================================================
// 학급 윤독도서 관리 시스템 애플리케이션 로직 (app.js)
// ========================================================

// 1. 초기 30명 학생 샘플 데이터
const DEFAULT_STUDENTS = [
  { student_number: 1, name: "1번 김도윤" },
  { student_number: 2, name: "2번 이서준" },
  { student_number: 3, name: "3번 박하은" },
  { student_number: 4, name: "4번 최시우" },
  { student_number: 5, name: "5번 정지호" },
  { student_number: 6, name: "6번 강예은" },
  { student_number: 7, name: "7번 조유준" },
  { student_number: 8, name: "8번 윤서아" },
  { student_number: 9, name: "9번 장민서" },
  { student_number: 10, name: "10번 임채원" },
  { student_number: 11, name: "11번 한도현" },
  { student_number: 12, name: "12번 오지우" },
  { student_number: 13, name: "13번 서예준" },
  { student_number: 14, name: "14번 신다은" },
  { student_number: 15, name: "15번 권민준" },
  { student_number: 16, name: "16번 황수아" },
  { student_number: 17, name: "17번 안시후" },
  { student_number: 18, name: "18번 송채린" },
  { student_number: 19, name: "19번 전은우" },
  { student_number: 20, name: "20번 홍지유" },
  { student_number: 21, name: "21번 류현우" },
  { student_number: 22, name: "22번 고서진" },
  { student_number: 23, name: "23번 문하윤" },
  { student_number: 24, name: "24번 양시안" },
  { student_number: 25, name: "25번 손지원" },
  { student_number: 26, name: "26번 배주원" },
  { student_number: 27, name: "27번 백은서" },
  { student_number: 28, name: "28번 허우진" },
  { student_number: 29, name: "29번 유소율" },
  { student_number: 30, name: "30번 남태양" }
];

// 2. 초기 30권 권장도서 샘플 데이터
const DEFAULT_BOOKS = [
  { book_number: 1, title: "1권 어린 왕자", cover_emoji: "👑" },
  { book_number: 2, title: "2권 마당을 나온 암탉", cover_emoji: "🐔" },
  { book_number: 3, title: "3권 샬롯의 거미줄", cover_emoji: "🕸️" },
  { book_number: 4, title: "4권 시간을 파는 상점", cover_emoji: "⏳" },
  { book_number: 5, title: "5권 아몬드", cover_emoji: "🌰" },
  { book_number: 6, title: "6권 자전거 도둑", cover_emoji: "🚲" },
  { book_number: 7, title: "7권 푸른 사자 와니니", cover_emoji: "🦁" },
  { book_number: 8, title: "8권 불량한 자전거 여행", cover_emoji: "🗺️" },
  { book_number: 9, title: "9권 욕심쟁이 딸기 아저씨", cover_emoji: "🍓" },
  { book_number: 10, title: "10권 괜찮아 우리는 친구야", cover_emoji: "🤝" },
  { book_number: 11, title: "11권 고양이 해결사 깜냥", cover_emoji: "🐱" },
  { book_number: 12, title: "12권 나무 집 시리즈", cover_emoji: "🏠" },
  { book_number: 13, title: "13권 만복이네 떡집", cover_emoji: "🍡" },
  { book_number: 14, title: "14권 수상한 아파트", cover_emoji: "🏢" },
  { book_number: 15, title: "15권 지각대장 존", cover_emoji: "⏰" },
  { book_number: 16, title: "16권 강아지 똥", cover_emoji: "🐕" },
  { book_number: 17, title: "17권 구름빵", cover_emoji: "☁️" },
  { book_number: 18, title: "18권 알사탕", cover_emoji: "🍬" },
  { book_number: 19, title: "19권 수박 수영장", cover_emoji: "🍉" },
  { book_number: 20, title: "20권 백희나 그림책", cover_emoji: "🎨" },
  { book_number: 21, title: "21권 수상한 도서관", cover_emoji: "📚" },
  { book_number: 22, title: "22권 우주로 간 토끼", cover_emoji: "🚀" },
  { book_number: 23, title: "23권 비밀의 숲", cover_emoji: "🌲" },
  { book_number: 24, title: "24권 미래 탐험대", cover_emoji: "🛸" },
  { book_number: 25, title: "25권 지구 구하기", cover_emoji: "🌍" },
  { book_number: 26, title: "26권 용기의 별자리", cover_emoji: "✨" },
  { book_number: 27, title: "27권 꿈을 찾는 나침반", cover_emoji: "🧭" },
  { book_number: 28, title: "28권 바다의 노래", cover_emoji: "🌊" },
  { book_number: 29, title: "29권 바람이 부는 곳", cover_emoji: "🍃" },
  { book_number: 30, title: "30권 빛나는 우리들", cover_emoji: "🌟" }
];

// 3. 애플리케이션 상태
let state = {
  currentWeek: 1,
  students: DEFAULT_STUDENTS,
  books: DEFAULT_BOOKS,
  readingChecks: {}, // key: `${student_number}_${book_number}` => boolean
  reviews: [], // array of { id, book_number, student_number, student_name, content, created_at }
  activeBookForModal: null,
  supabaseClient: null,
  isOnlineMode: false
};

// 4. 데이터베이스 및 저장소 서비스
const StorageService = {
  initSupabase() {
    // 1. config.js에 설정된 값이 있는지 확인
    const configUrl = window.__APP_CONFIG__?.SUPABASE_URL?.trim();
    const configKey = window.__APP_CONFIG__?.SUPABASE_ANON_KEY?.trim();

    // 2. localStorage에 저장된 값이 있는지 확인
    const localUrl = localStorage.getItem("sb_url")?.trim();
    const localKey = localStorage.getItem("sb_anon_key")?.trim();

    const url = configUrl || localUrl;
    const key = configKey || localKey;

    if (url && key && window.supabase) {
      try {
        state.supabaseClient = window.supabase.createClient(url, key);
        state.isOnlineMode = true;
        this.updateSyncBadge("실시간 동기화 (Supabase)");
        return true;
      } catch (e) {
        console.error("Supabase 초기화 실패", e);
      }
    }
    state.isOnlineMode = false;
    this.updateSyncBadge("체험/로컬 모드 (브라우저 저장)");
    return false;
  },

  updateSyncBadge(text) {
    const badge = document.getElementById("sync-badge");
    const dot = document.getElementById("sync-dot");
    if (badge && dot) {
      badge.textContent = text;
      if (state.isOnlineMode) {
        dot.className = "w-2 h-2 rounded-full bg-emerald-500 animate-pulse";
      } else {
        dot.className = "w-2 h-2 rounded-full bg-amber-500";
      }
    }
  },

  async loadAll() {
    if (state.isOnlineMode) {
      try {
        const sb = state.supabaseClient;
        const [stRes, bkRes, chkRes, revRes, setRes] = await Promise.all([
          sb.from("students").select("*").order("student_number"),
          sb.from("books").select("*").order("book_number"),
          sb.from("reading_checks").select("*"),
          sb.from("book_reviews").select("*").order("created_at", { ascending: false }),
          sb.from("class_settings").select("*").eq("key", "current_week").single()
        ]);

        if (stRes.data && stRes.data.length > 0) state.students = stRes.data;
        if (bkRes.data && bkRes.data.length > 0) state.books = bkRes.data;
        
        state.readingChecks = {};
        if (chkRes.data) {
          chkRes.data.forEach(c => {
            if (c.is_completed) {
              state.readingChecks[`${c.student_number}_${c.book_number}`] = true;
            }
          });
        }

        state.reviews = revRes.data || [];
        if (setRes.data && setRes.data.value) {
          state.currentWeek = Number(setRes.data.value) || 1;
        }

        this.subscribeRealtime();
        return;
      } catch (err) {
        console.warn("Supabase 데이터 로드 중 오류, 로컬 저장소로 유지합니다.", err);
      }
    }

    // 로컬 스토리지 데이터 로드
    const savedChecks = localStorage.getItem("yd_checks");
    const savedReviews = localStorage.getItem("yd_reviews");
    const savedWeek = localStorage.getItem("yd_current_week");

    state.readingChecks = savedChecks ? JSON.parse(savedChecks) : {};
    state.reviews = savedReviews ? JSON.parse(savedReviews) : [];
    state.currentWeek = savedWeek ? Number(savedWeek) : 1;
  },

  subscribeRealtime() {
    if (!state.isOnlineMode || !state.supabaseClient) return;
    try {
      state.supabaseClient
        .channel("class_changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "reading_checks" }, (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const row = payload.new;
            state.readingChecks[`${row.student_number}_${row.book_number}`] = row.is_completed;
          } else if (payload.eventType === "DELETE") {
            const oldRow = payload.old;
            delete state.readingChecks[`${oldRow.student_number}_${oldRow.book_number}`];
          }
          renderMatrix();
          updateStats();
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "book_reviews" }, () => {
          this.refreshReviews();
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "class_settings" }, (payload) => {
          if (payload.new && payload.new.key === "current_week") {
            state.currentWeek = Number(payload.new.value) || 1;
            renderMatrix();
            updateStats();
          }
        })
        .subscribe();
    } catch (e) {
      console.warn("Realtime 구독 에러:", e);
    }
  },

  async refreshReviews() {
    if (state.isOnlineMode && state.supabaseClient) {
      const { data } = await state.supabaseClient
        .from("book_reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) {
        state.reviews = data;
        if (state.activeBookForModal) {
          renderReviewsList(state.activeBookForModal.book_number);
        }
      }
    }
  },

  async toggleCheck(studentNumber, bookNumber) {
    const key = `${studentNumber}_${bookNumber}`;
    const nextState = !state.readingChecks[key];

    if (nextState) {
      state.readingChecks[key] = true;
    } else {
      delete state.readingChecks[key];
    }

    renderMatrix();
    updateStats();

    if (state.isOnlineMode && state.supabaseClient) {
      try {
        await state.supabaseClient
          .from("reading_checks")
          .upsert({
            student_number: studentNumber,
            book_number: bookNumber,
            is_completed: nextState,
            completed_at: new Date().toISOString()
          }, { onConflict: "student_number,book_number" });
      } catch (e) {
        console.error("완독 체크 저장 실패:", e);
      }
    } else {
      localStorage.setItem("yd_checks", JSON.stringify(state.readingChecks));
    }
  },

  async setWeek(weekNum) {
    state.currentWeek = Math.max(1, weekNum);
    renderMatrix();
    updateStats();

    if (state.isOnlineMode && state.supabaseClient) {
      try {
        await state.supabaseClient
          .from("class_settings")
          .upsert({ key: "current_week", value: state.currentWeek });
      } catch (e) {
        console.error("주차 저장 실패:", e);
      }
    } else {
      localStorage.setItem("yd_current_week", state.currentWeek);
    }
  },

  async addReview(bookNumber, studentNumber, studentName, content) {
    const newReview = {
      id: "rev_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
      book_number: bookNumber,
      student_number: studentNumber,
      student_name: studentName,
      content: content.trim(),
      created_at: new Date().toISOString()
    };

    if (state.isOnlineMode && state.supabaseClient) {
      try {
        const { data, error } = await state.supabaseClient
          .from("book_reviews")
          .insert({
            book_number: bookNumber,
            student_number: studentNumber,
            student_name: studentName,
            content: content.trim()
          })
          .select()
          .single();

        if (error) throw error;
        if (data) state.reviews.unshift(data);
      } catch (e) {
        alert("글 저장 실패: " + e.message);
        return false;
      }
    } else {
      state.reviews.unshift(newReview);
      localStorage.setItem("yd_reviews", JSON.stringify(state.reviews));
    }

    return true;
  }
};

// ========================================================
// 5. 로테이션 알고리즘 (순환 공식)
// ========================================================
function getAssignedBookNumber(studentNumber, week, totalCount) {
  if (totalCount <= 0) return 1;
  const zeroBasedStudent = studentNumber - 1;
  const zeroBasedWeek = week - 1;
  return ((zeroBasedStudent + zeroBasedWeek) % totalCount) + 1;
}

function getAssignedStudentForBook(bookNumber, week, totalCount) {
  if (totalCount <= 0) return null;
  for (let s = 1; s <= totalCount; s++) {
    if (getAssignedBookNumber(s, week, totalCount) === bookNumber) {
      return state.students.find(st => st.student_number === s) || { student_number: s, name: `${s}번 학생` };
    }
  }
  return null;
}

// ========================================================
// 6. UI 렌더링
// ========================================================
function renderMatrix() {
  const theadTr = document.getElementById("matrix-thead-tr");
  const tbody = document.getElementById("matrix-tbody");
  if (!theadTr || !tbody) return;

  const totalBooks = state.books.length;
  const totalStudents = state.students.length;
  const maxCount = Math.max(totalBooks, totalStudents);

  // 상단 책 헤더
  let headHtml = `
    <th class="corner-cell px-4 py-3 text-left font-bold text-slate-700 border-b border-r border-slate-200 shadow-sm w-36 min-w-[140px] bg-slate-100">
      <div class="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wider">
        <span>학생 \\ 도서</span>
      </div>
      <div class="text-xs text-indigo-600 font-bold mt-0.5">${state.currentWeek}주차 진행중</div>
    </th>
  `;

  state.books.forEach(book => {
    const currentReader = getAssignedStudentForBook(book.book_number, state.currentWeek, maxCount);
    headHtml += `
      <th class="book-header px-2 py-2.5 text-center border-b border-r border-slate-200 min-w-[105px] max-w-[125px] bg-white transition-colors">
        <button onclick="openBookModal(${book.book_number})" class="book-card-btn w-full flex flex-col items-center p-2 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer text-left group" title="클릭하여 느낀 점(독서록) 보기">
          <span class="text-2xl mb-1 filter drop-shadow-sm group-hover:scale-110 transition-transform">${book.cover_emoji || '📖'}</span>
          <span class="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600">${book.title}</span>
          <span class="text-[10px] text-slate-400 font-medium mt-0.5">#${book.book_number}번 책</span>
          <div class="mt-1.5 w-full text-center py-0.5 px-1 rounded bg-amber-100/90 text-[10px] text-amber-900 font-bold truncate">
            이번주: ${currentReader ? currentReader.name : '-'}
          </div>
        </button>
      </th>
    `;
  });
  theadTr.innerHTML = headHtml;

  // 좌측 학생 행 및 체크 셀
  let bodyHtml = "";
  state.students.forEach(student => {
    const assignedBookNum = getAssignedBookNumber(student.student_number, state.currentWeek, maxCount);

    bodyHtml += `<tr class="hover:bg-slate-50/60 transition-colors">`;
    bodyHtml += `
      <th class="student-header px-3 py-2.5 text-left border-b border-r border-slate-200 font-semibold text-slate-800 w-36 min-w-[140px] bg-white shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-sm">${student.name}</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">#${student.student_number}</span>
        </div>
      </th>
    `;

    state.books.forEach(book => {
      const isCurrentAssignment = (book.book_number === assignedBookNum);
      const isChecked = !!state.readingChecks[`${student.student_number}_${book.book_number}`];
      
      let cellClasses = "px-2 py-2 text-center border-b border-r border-slate-200 cursor-pointer transition-all select-none ";
      if (isCurrentAssignment) {
        cellClasses += "cell-current-assignment ";
      }
      if (isChecked) {
        cellClasses += "cell-read-completed ";
      }

      bodyHtml += `
        <td class="${cellClasses}" onclick="StorageService.toggleCheck(${student.student_number}, ${book.book_number})" title="${student.name} - ${book.title} (완독 체크 클릭)">
          <div class="flex items-center justify-center min-h-[38px]">
            ${isChecked ? `
              <div class="check-icon flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            ` : `
              <div class="w-6 h-6 rounded-lg border-2 ${isCurrentAssignment ? 'border-amber-400 bg-white/80' : 'border-slate-200 hover:border-slate-400'} flex items-center justify-center text-transparent hover:text-slate-300">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            `}
          </div>
        </td>
      `;
    });

    bodyHtml += `</tr>`;
  });
  tbody.innerHTML = bodyHtml;

  const weekLabel = document.getElementById("current-week-display");
  if (weekLabel) weekLabel.textContent = `${state.currentWeek}주차`;
}

function updateStats() {
  const totalStudents = state.students.length;
  const maxCount = Math.max(totalStudents, state.books.length);

  let thisWeekCompletedCount = 0;
  state.students.forEach(student => {
    const assignedBook = getAssignedBookNumber(student.student_number, state.currentWeek, maxCount);
    if (state.readingChecks[`${student.student_number}_${assignedBook}`]) {
      thisWeekCompletedCount++;
    }
  });

  const completionRate = totalStudents > 0 ? Math.round((thisWeekCompletedCount / totalStudents) * 100) : 0;

  const countEl = document.getElementById("stat-completed-count");
  const rateEl = document.getElementById("stat-completion-rate");
  const studentTotalEl = document.getElementById("stat-total-students");
  const reviewCountEl = document.getElementById("stat-total-reviews");

  if (countEl) countEl.textContent = `${thisWeekCompletedCount} / ${totalStudents}명`;
  if (rateEl) rateEl.textContent = `${completionRate}%`;
  if (studentTotalEl) studentTotalEl.textContent = `${totalStudents}명 (${state.books.length}권)`;
  if (reviewCountEl) reviewCountEl.textContent = `${state.reviews.length}개`;
}

// ========================================================
// 7. 독서록 & 3줄 느낀 점 (한번 제출 시 수정 불가)
// ========================================================
function openBookModal(bookNumber) {
  const book = state.books.find(b => b.book_number === bookNumber);
  if (!book) return;

  state.activeBookForModal = book;
  const modal = document.getElementById("review-modal");
  const modalTitle = document.getElementById("modal-book-title");
  const modalCover = document.getElementById("modal-book-cover");
  const modalCurrentReader = document.getElementById("modal-current-reader");
  const authorSelect = document.getElementById("modal-student-select");

  if (modalTitle) modalTitle.textContent = book.title;
  if (modalCover) modalCover.textContent = book.cover_emoji || '📖';

  const reader = getAssignedStudentForBook(book.book_number, state.currentWeek, Math.max(state.books.length, state.students.length));
  if (modalCurrentReader) {
    modalCurrentReader.textContent = reader ? `${state.currentWeek}주차 배당 학생: ${reader.name}` : `배당 정보 없음`;
  }

  if (authorSelect) {
    authorSelect.innerHTML = `<option value="">-- 내 번호와 이름을 선택하세요 --</option>` +
      state.students.map(s => `
        <option value="${s.student_number}">${s.name}</option>
      `).join("");

    if (reader) {
      authorSelect.value = String(reader.student_number);
    }
  }

  const contentInput = document.getElementById("review-content-input");
  if (contentInput) contentInput.value = "";

  renderReviewsList(bookNumber);
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeBookModal() {
  const modal = document.getElementById("review-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
  state.activeBookForModal = null;
}

function renderReviewsList(bookNumber) {
  const listContainer = document.getElementById("reviews-list-container");
  if (!listContainer) return;

  const bookReviews = state.reviews.filter(r => Number(r.book_number) === Number(bookNumber));

  if (bookReviews.length === 0) {
    listContainer.innerHTML = `
      <div class="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <span class="text-3xl block mb-2">✍️</span>
        <p class="text-sm font-medium text-slate-600">아직 등록된 느낀 점이 없습니다.</p>
        <p class="text-xs text-slate-400 mt-1">이 책을 읽고 아래에서 첫 번째 3줄 소감을 남겨보세요!</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = bookReviews.map(rev => {
    const formattedDate = new Date(rev.created_at).toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <div class="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              ${rev.student_number || '?'}
            </div>
            <span class="font-bold text-xs sm:text-sm text-slate-800">${rev.student_name}</span>
          </div>
          <span class="text-[11px] text-slate-400">${formattedDate}</span>
        </div>
        <div class="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
          ${escapeHtml(rev.content)}
        </div>
      </div>
    `;
  }).join("");
}

async function handleAddReviewSubmit(e) {
  e.preventDefault();
  if (!state.activeBookForModal) return;

  const authorSelect = document.getElementById("modal-student-select");
  const contentInput = document.getElementById("review-content-input");

  const studentNum = Number(authorSelect.value);
  const student = state.students.find(s => s.student_number === studentNum);
  const content = contentInput.value.trim();

  if (!studentNum || !student) {
    alert("작성자(본인 이름)를 선택해주세요.");
    authorSelect.focus();
    return;
  }
  if (!content) {
    alert("느낀 점을 3줄 내외로 작성해주세요.");
    contentInput.focus();
    return;
  }

  // 제출 전 확인 (한번 제출하면 수정 불가 원칙)
  const confirmed = confirm(
    `[${student.name}] 학생의 소감으로 등록하시겠습니까?\n\n※ 한번 제출하면 수정이나 삭제가 불가능합니다.`
  );
  if (!confirmed) return;

  const ok = await StorageService.addReview(
    state.activeBookForModal.book_number,
    student.student_number,
    student.name,
    content
  );

  if (ok) {
    contentInput.value = "";
    renderReviewsList(state.activeBookForModal.book_number);
    updateStats();
    alert("느낀 점이 성공적으로 등록되었습니다!");
  }
}

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ========================================================
// 8. 선생님 전용 주차 넘기기 (수동 로테이션)
// ========================================================
function nextWeekByTeacher() {
  const targetWeek = state.currentWeek + 1;
  const isOk = confirm(
    `📢 [선생님 주차 관리]\n\n윤독도서를 다음 주차(${targetWeek}주차)로 넘기시겠습니까?\n\n모든 학생의 배정 도서가 번호 순서대로 한 칸씩 다음 책으로 이동합니다.`
  );
  if (isOk) {
    StorageService.setWeek(targetWeek);
  }
}

function prevWeekByTeacher() {
  if (state.currentWeek <= 1) {
    alert("1주차 이전으로는 이동할 수 없습니다.");
    return;
  }
  const targetWeek = state.currentWeek - 1;
  const isOk = confirm(
    `이전 주차(${targetWeek}주차)로 되돌리시겠습니까?`
  );
  if (isOk) {
    StorageService.setWeek(targetWeek);
  }
}

// ========================================================
// 9. 설정 및 초기화
// ========================================================
function openSettingsModal() {
  const modal = document.getElementById("settings-modal");
  const urlInput = document.getElementById("sb-url-input");
  const keyInput = document.getElementById("sb-key-input");

  if (urlInput) urlInput.value = localStorage.getItem("sb_url") || "";
  if (keyInput) keyInput.value = localStorage.getItem("sb_anon_key") || "";

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeSettingsModal() {
  const modal = document.getElementById("settings-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

async function saveSettings(e) {
  e.preventDefault();
  const urlInput = document.getElementById("sb-url-input");
  const keyInput = document.getElementById("sb-key-input");

  const url = urlInput.value.trim();
  const key = keyInput.value.trim();

  if (url && key) {
    localStorage.setItem("sb_url", url);
    localStorage.setItem("sb_anon_key", key);
  } else {
    localStorage.removeItem("sb_url");
    localStorage.removeItem("sb_anon_key");
  }

  closeSettingsModal();
  StorageService.initSupabase();
  await StorageService.loadAll();
  renderMatrix();
  updateStats();
  alert("설정이 저장되었습니다.");
}

function resetAllData() {
  if (confirm("정말로 모든 체크 기록과 느낀 점을 초기화하시겠습니까? (로컬 데이터 기준)")) {
    localStorage.removeItem("yd_checks");
    localStorage.removeItem("yd_reviews");
    state.readingChecks = {};
    state.reviews = [];
    renderMatrix();
    updateStats();
    alert("데이터가 초기화되었습니다.");
  }
}

// 초기 로딩
window.addEventListener("DOMContentLoaded", async () => {
  StorageService.initSupabase();
  await StorageService.loadAll();
  renderMatrix();
  updateStats();

  document.getElementById("btn-teacher-prev-week")?.addEventListener("click", prevWeekByTeacher);
  document.getElementById("btn-teacher-next-week")?.addEventListener("click", nextWeekByTeacher);
  document.getElementById("btn-close-review-modal")?.addEventListener("click", closeBookModal);
  document.getElementById("btn-close-settings-modal")?.addEventListener("click", closeSettingsModal);
  document.getElementById("review-form")?.addEventListener("submit", handleAddReviewSubmit);
  document.getElementById("settings-form")?.addEventListener("submit", saveSettings);
  document.getElementById("btn-reset-data")?.addEventListener("click", resetAllData);
});
