# WEEK4주차 1회차 Vue 생태계 실습 가이드 (강사용)

본 문서는 3-2에서 완성한 Todo 앱을 그대로 이어 받아, Vue 생태계 도구를 실제 기능 확장에 연결하는 4-1 회차 강사용 진행 가이드이다.

이번 회차의 핵심은 문법 소개가 아니라 다음 두 질문에 답하게 만드는 것이다.

- 상태가 커지면 왜 컴포넌트 내부 `ref`만으로 관리하기 어려워지는가
- 화면이 2개 이상이 되면 왜 Router가 필요한가

## 이번 회차 목표

- 기존 Todo 앱을 단일 컴포넌트 구조에서 벗어나게 만든다.
- 기능을 기준으로 컴포넌트를 어떻게 나눌지 설명할 수 있게 만든다.
- Pinia를 도입해 할 일 목록 상태와 관련 동작을 store로 분리한다.
- LocalStorage를 붙여 새로고침 후에도 데이터가 유지되게 만든다.
- Todo 항목에 `memo` 필드를 추가한다.
- Vue Router를 도입해 목록 페이지와 상세 페이지를 분리한다.
- 상세 페이지에서 특정 Todo의 내용과 메모를 수정하는 흐름을 완성한다.

## 수업 시작 전 전제

- 실습 시작점은 3-2에서 만든 Todo 앱이다.
- 4-1의 `todo-app`은 3-2 코드를 복사해 둔 상태라고 가정한다.
- UI 컴포넌트는 기존 PrimeVue 구성을 그대로 유지한다.

수업 전 반드시 점검할 것

- `package.json`이 존재하는지
- `src/main.js` 또는 `src/main.ts`가 존재하는지
- `src/App.vue`가 기존 Todo 앱 상태인지
- 개발 서버가 정상 실행되는지

저장소 상태가 정리되지 않았다면, 수업 전에 3-2 프로젝트 기준으로 실행 가능한 시작점을 먼저 맞춰 둔다.

## 완성 결과

수업이 끝나면 아래 흐름이 동작해야 한다.

- 목록 페이지에서 할 일을 추가할 수 있다.
- 각 Todo는 `id`, `text`, `memo`, `completed` 값을 가진다.
- 상세 보기 버튼 또는 제목 클릭으로 상세 페이지로 이동할 수 있다.
- 상세 페이지에서 메모를 입력하고 저장할 수 있다.
- 브라우저 새로고침 후에도 목록과 메모가 유지된다.
- 잘못된 Todo ID로 진입하면 예외 상황을 처리할 수 있다.

## 권장 시간 배분

- 0~10분: 기존 3-2 코드 복습, 구조적 한계 짚기
- 10~25분: 컴포넌트 분리 기준 설명, 역할 나누기
- 25~35분: Pinia와 Vue Router 설치, 폴더 구조 설명
- 35~50분: Todo 데이터 구조 확장, Pinia store 생성
- 50~60분: LocalStorage 연동
- 60~75분: 목록 페이지 분리, 상세 페이지 요구사항 설명
- 75~85분: Vue Router 연결, 목록/상세 이동 구현
- 85~90분: 메모 수정 흐름 점검, 마무리 정리

## 강의 핵심 메시지

- 컴포넌트 안에 상태가 몰리면 화면은 보여도 구조는 빠르게 무거워진다.
- 컴포넌트 분리는 파일 수를 늘리는 작업이 아니라 책임을 나누는 작업이다.
- Pinia는 전역 상태 저장소이지만, 아무 값이나 다 넣는 곳은 아니다.
- Router는 단순 이동 도구가 아니라 화면 상태를 URL로 표현하는 방법이다.
- LocalStorage는 영속화 수단이지 반응형 상태 자체가 아니다.
- 상세 페이지가 생기면 항목 식별 기준이 `index`가 아니라 `id`여야 한다.

## 실습 흐름

### Part 1. 기존 Todo 앱 복습과 한계 찾기

먼저 3-2에서 만든 Todo 앱을 다시 실행하고, 현재 구조를 수강생과 함께 읽는다.

현재 코드에서 짚을 포인트

- `App.vue` 하나에 입력, 목록, 수정, 삭제 로직이 모두 들어 있다.
- Todo 항목 구조가 `text`, `completed` 정도에 머물러 있다.
- 항목 식별을 `index`에 의존하고 있을 가능성이 높다.
- 새로고침하면 데이터가 초기화된다.
- 화면이 하나뿐이라 URL 이동 개념이 없다.

수업 중 던질 질문

- "이 앱이 조금만 커져도 `App.vue` 하나로 버틸 수 있을까요?"
- "특정 할 일만 따로 보여 주고 싶으면 지금 구조에서 어떻게 해야 할까요?"
- "새로고침했을 때 데이터가 사라지는 것은 상태 문제일까요, 저장 문제일까요?"

이 단계의 목표는 곧바로 코딩하는 것이 아니라, Pinia와 Router를 왜 도입하는지 납득시키는 것이다.

### Part 2. 컴포넌트 개발 방법 먼저 설명하기

Pinia와 Router를 도입하기 전에, 먼저 컴포넌트를 어떤 기준으로 나누는지 짚고 가는 편이 자연스럽다.

이 단계에서 설명할 핵심

- 화면을 먼저 통째로 만들고, 반복되거나 책임이 뚜렷한 부분부터 분리한다.
- 컴포넌트는 "재사용 가능해서"만 나누는 것이 아니라 "읽기 쉽고 책임이 분리되도록" 나눈다.
- 입력값처럼 한 화면 안에서만 쓰는 값은 로컬 상태로 둔다.
- 여러 화면이 함께 써야 하는 Todo 목록 자체는 나중에 store로 올리는 것이 자연스럽다.

권장 설명 순서

1. 현재 `App.vue`가 어떤 책임을 동시에 가지고 있는지 나열한다.
2. 입력 영역, 목록 영역, 항목 한 줄을 각각 별도 조각으로 볼 수 있는지 질문한다.
3. 컴포넌트로 나눠도 되는 것과 아직 나누지 않아도 되는 것을 구분한다.
4. 그 다음에 Pinia와 Router가 필요한 이유를 연결한다.

예시로 보여 줄 분리 기준

- `TodoForm`: 입력과 등록 버튼 담당
- `TodoList`: 목록 반복 렌더링 담당
- `TodoItem`: 항목 1개 표시와 클릭 이벤트 전달 담당
- `TodoDetailView`: 상세 수정 화면 담당

반드시 짚을 것

- 컴포넌트는 화면 조각의 책임으로 나눈다.
- 상태를 어디에 둘지는 컴포넌트 분리와 함께 결정해야 한다.
- Props는 데이터를 내려 주는 통로이고, 이벤트는 변경 의도를 올려 보내는 통로다.

수업 중 던질 질문

- "입력창 값은 전역 상태일까요, 지역 상태일까요?"
- "삭제 버튼 클릭은 항목 컴포넌트 안에서 끝내야 할까요, 부모에게 알려야 할까요?"
- "메모 편집 화면은 목록 컴포넌트 안에 넣는 게 자연스러울까요, 별도 화면으로 빼는 게 자연스러울까요?"

강의 멘트 예시

- "컴포넌트 분리는 예쁘게 쪼개는 작업이 아니라, 어디가 무엇을 책임지는지 분명하게 만드는 작업입니다."
- "지금은 먼저 화면 조각을 나누고, 그 다음에 여러 조각이 함께 쓰는 상태만 store로 올리겠습니다."

#### 바로 복사해서 등록하는 순서

이 단계는 Pinia와 Router를 아직 붙이지 않은 상태에서, 현재 `App.vue`를 안전하게 쪼개는 중간 단계다. 아래 순서대로 파일을 만들고 마지막에 `App.vue`만 교체하면 된다.

먼저 만들 폴더

- `src/components`
- `src/views`

등록 순서

1. `src/components/TodoForm.vue`
2. `src/components/TodoItem.vue`
3. `src/components/TodoList.vue`
4. `src/views/TodoListView.vue`
5. `src/App.vue`

##### 1. `src/components/TodoForm.vue`

입력창과 등록 버튼만 담당하는 컴포넌트다.

```vue
<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])
</script>

<template>
  <InputGroup>
    <InputText
      class="w-full"
      size="small"
      placeholder="할 일을 입력하세요"
      :modelValue="props.modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      @keyup.enter="emit('submit')"
    />
    <Button class="grow-0 whitespace-nowrap" size="small" @click="emit('submit')">등록</Button>
  </InputGroup>
</template>
```

##### 2. `src/components/TodoItem.vue`

목록 한 줄 표현과 수정, 삭제 버튼을 담당한다.

```vue
<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit', 'confirm', 'remove'])
</script>

<template>
  <li class="flex flex-col">
    <div class="flex justify-between">
      <div class="flex items-center">
        <ToggleSwitch class="mr-2" size="small" v-model="item.completed" />
        <span v-if="!isEditing" :class="{ 'line-through': item.completed }">
          {{ item.text }}
        </span>
        <InputGroup v-else>
          <InputText size="small" v-model="item.text" @keyup.enter="emit('confirm', index)" />
          <Button icon="pi pi-save" size="small" @click="emit('confirm', index)" />
        </InputGroup>
      </div>

      <div class="flex items-center gap-1">
        <Button
          icon="pi pi-pen-to-square"
          size="small"
          @click="emit('edit', index)"
          :disabled="isEditing"
        />
        <Button
          icon="pi pi-trash"
          size="small"
          @click="emit('remove', index)"
          :disabled="isEditing"
        />
      </div>
    </div>
  </li>
</template>
```

##### 3. `src/components/TodoList.vue`

배열을 반복 렌더링하고, 각 항목 이벤트를 부모로 다시 올려 보낸다.

```vue
<script setup>
import TodoItem from './TodoItem.vue'

const props = defineProps({
  todoList: {
    type: Array,
    required: true,
  },
  updateItemTargets: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['edit', 'confirm', 'remove'])
</script>

<template>
  <ul class="list-none space-y-1">
    <TodoItem
      v-for="(item, index) in props.todoList"
      :key="index"
      :item="item"
      :index="index"
      :isEditing="props.updateItemTargets.includes(index)"
      @edit="emit('edit', $event)"
      @confirm="emit('confirm', $event)"
      @remove="emit('remove', $event)"
    />
  </ul>
</template>
```

##### 4. `src/views/TodoListView.vue`

현재 `App.vue`에 몰려 있던 상태와 함수를 여기로 옮긴다. 아직은 Pinia를 쓰지 않는 단계이므로, `ref` 기반 상태를 그대로 유지한다.

```vue
<script setup>
import { ref } from 'vue'
import TodoForm from '../components/TodoForm.vue'
import TodoList from '../components/TodoList.vue'

const newTodoItem = ref('')
const updateItemTargets = ref([])

const todoList = ref([
  {
    text: '할 일 1',
    completed: false,
  },
  {
    text: '할 일 2',
    completed: true,
  },
])

function addTodoList() {
  if (!newTodoItem.value.trim()) {
    return
  }

  todoList.value.push({
    text: newTodoItem.value,
    completed: false,
  })

  newTodoItem.value = ''
}

function removeTodoList(index) {
  todoList.value.splice(index, 1)
}

function modifyTodoItem(index) {
  if (!updateItemTargets.value.includes(index)) {
    updateItemTargets.value.push(index)
  }
}

function confirmModifyTodo(index) {
  updateItemTargets.value.splice(updateItemTargets.value.indexOf(index), 1)
}
</script>

<template>
  <h1 class="text-3xl font-bold underline">Todo List</h1>

  <div class="w-96">
    <TodoForm v-model="newTodoItem" @submit="addTodoList" />

    <div class="pt-3">
      <TodoList
        :todoList="todoList"
        :updateItemTargets="updateItemTargets"
        @edit="modifyTodoItem"
        @confirm="confirmModifyTodo"
        @remove="removeTodoList"
      />
    </div>
  </div>
</template>
```

##### 5. `src/App.vue`

루트 컴포넌트는 이제 화면 하나를 불러오는 역할만 남긴다.

```vue
<script setup>
import TodoListView from './views/TodoListView.vue'
</script>

<template>
  <TodoListView />
</template>
```

##### 6. 여기까지 끝났을 때 확인할 것

- 화면 동작은 기존과 같아야 한다.
- 입력, 등록, 수정, 삭제가 모두 그대로 동작해야 한다.
- 아직 Pinia와 Router는 없어도 된다.
- 이 단계의 목적은 기능 추가가 아니라 책임 분리다.

이 중간 단계를 먼저 만들고 나면, 다음 단계에서 `TodoListView`의 상태를 store로 옮기고, 마지막에 view를 Router 기반 화면으로 나누기가 훨씬 쉬워진다.

### Part 3. 오늘 추가할 생태계 도구 소개

오늘 도입할 도구는 두 가지다.

- Pinia: 여러 화면에서 공유할 Todo 상태를 관리
- Vue Router: 목록 페이지와 상세 페이지를 URL 기반으로 분리

설치 명령 예시

```sh
npm install pinia vue-router
```

설명 포인트

- Pinia는 Vue 팀이 권장하는 공식 상태 관리 도구다.
- Vue Router는 Vue 애플리케이션에서 화면 전환을 담당하는 공식 라우터다.
- 둘 다 "기능을 늘리기 위한 도구"가 아니라 "구조를 분리하기 위한 도구"로 소개한다.

### Part 4. 데이터 구조 먼저 바꾸기

Pinia나 Router를 붙이기 전에 Todo 데이터 구조부터 확장한다.

권장 Todo 구조

```js
{
  id: 1,
  text: '강의안 정리',
  memo: 'Pinia 예제 캡처 추가',
  completed: false,
}
```

반드시 강조할 것

- 상세 페이지가 생기면 `index` 대신 고유한 `id`가 필요하다.
- `memo`는 빈 문자열로 시작해도 된다.
- 목록에서 필요한 정보와 상세에서 필요한 정보가 다를 수 있다.

자주 나오는 실수

- 기존 배열 인덱스를 그대로 URL 파라미터처럼 사용한다.
- `memo`를 별도 배열이나 별도 상태로 관리하려 한다.

### Part 5. Pinia store로 상태 옮기기

이제 Todo 상태를 컴포넌트 밖으로 꺼낸다.

권장 분리 방향

```text
src/
  main.js
  App.vue
  router/
    index.js
  stores/
    todo.js
  views/
    TodoListView.vue
    TodoDetailView.vue
  components/
    TodoForm.vue
    TodoList.vue
    TodoItem.vue
```

처음부터 너무 잘게 나눌 필요는 없다. 이번 회차에서는 아래 정도만 지켜도 충분하다.

- Todo 목록 데이터는 store로 이동
- 추가, 삭제, 수정, 완료 토글 로직도 store action으로 이동
- 화면에서만 필요한 입력값이나 임시 편집 상태는 각 view 안에 남겨도 된다

store에 넣을 후보

- `todos`
- `addTodo()`
- `removeTodo()`
- `toggleTodo()`
- `updateTodo()`
- `getTodoById()` 또는 getter

강의 멘트 예시

- "모든 상태를 store로 보내는 게 목적이 아닙니다. 여러 화면에서 같이 써야 하는 상태를 밖으로 꺼내는 겁니다."
- "입력창의 현재 값은 로컬 상태로 둘 수 있지만, Todo 목록 자체는 공유 상태로 보는 편이 자연스럽습니다."

### Part 6. LocalStorage 붙이기

이번 회차에서 Pinia를 소개할 때 반드시 같이 보여 줄 부분이다. 저장소가 생겼다고 해서 자동으로 새로고침 유지가 되는 것은 아니기 때문이다.

가르칠 흐름

1. 앱 시작 시 LocalStorage에서 기존 Todo 배열을 읽는다.
2. store 상태가 바뀌면 LocalStorage에 다시 저장한다.
3. 저장 데이터가 없거나 파싱에 실패하면 기본값으로 안전하게 처리한다.

강조 메시지

- LocalStorage는 브라우저 저장소다.
- Pinia store는 메모리 안의 반응형 상태다.
- 둘을 연결해야 "반응형 + 저장"이 동시에 된다.

설명 포인트

- 저장 키 이름은 한 곳에서 상수로 관리하면 좋다.
- `JSON.parse` 실패 가능성을 반드시 언급한다.
- 저장 로직은 개별 컴포넌트보다 store 근처에 두는 편이 관리가 쉽다.

질문 유도 예시

- "새로고침 후에도 데이터가 남으려면, 지금 어디에 저장돼 있어야 할까요?"
- "LocalStorage 값이 Vue 화면을 자동으로 갱신해 줄까요, 아니면 store에 다시 넣어야 할까요?"

### Part 7. 목록 페이지와 상세 페이지 요구사항 정의

Router를 붙이기 전에 먼저 화면 요구사항을 문장으로 확정한다.

목록 페이지 요구사항

- Todo 목록을 보여 준다.
- 새 Todo를 추가할 수 있다.
- 각 항목에 상세 이동 버튼 또는 링크가 있다.
- 완료 토글과 삭제는 목록에서도 가능하다.

상세 페이지 요구사항

- URL에서 Todo ID를 읽는다.
- 해당 Todo를 store에서 찾는다.
- 제목, 완료 여부, 메모를 확인하거나 수정할 수 있다.
- 저장 후 목록으로 돌아가거나, 뒤로 가기를 제공한다.

이 단계에서 수강생이 먼저 생각하게 할 것

- 상세 페이지에서 어떤 데이터가 꼭 보여야 하는가
- 목록 페이지에 메모 전체를 보여 줄 필요가 있는가
- Todo가 존재하지 않을 때 어떤 화면을 보여 줄 것인가

### Part 8. Vue Router 연결

이제 Router를 등록한다.

기본 라우트 예시

- `/`: Todo 목록 페이지
- `/todos/:id`: Todo 상세 페이지

설명 포인트

- `App.vue`는 전체 레이아웃과 `RouterView` 중심으로 단순화된다.
- 목록과 상세는 서로 다른 컴포넌트가 아니라, 서로 다른 화면이다.
- URL이 곧 현재 화면 상태를 설명한다.

반드시 짚을 것

- 왜 `/todos/:id` 형태가 필요한가
- 동적 파라미터를 받아 store에서 항목을 찾는 흐름
- 존재하지 않는 ID일 때의 예외 처리

자주 나오는 실수

- 라우트 파라미터가 문자열이라는 점을 놓친다.
- 목록에서 선택한 항목 전체를 직접 넘기려 한다.
- `RouterView`와 일반 컴포넌트 렌더링 차이를 혼동한다.

### Part 9. 상세 페이지에서 메모 수정 흐름 만들기

이번 회차의 기능적 완성 포인트다.

상세 페이지에서 구현할 요소

- Todo 제목 표시 또는 수정 입력창
- 완료 여부 토글
- 메모 입력 영역
- 저장 버튼
- 목록으로 돌아가기 버튼

강의 진행 팁

- 상세 페이지에서는 메모 입력에 집중하게 한다.
- 목록 화면에는 메모 요약만 보여 주거나 아예 보여 주지 않아도 된다.
- 저장 버튼 클릭 시 store action을 호출하는 구조를 반복 확인시킨다.

강조 메시지

- "상세 페이지는 새로운 데이터를 만드는 곳이 아니라, 이미 있는 Todo를 더 자세히 다루는 화면입니다."
- "입력 요소가 늘어나도 진짜 원본 상태는 store에 있어야 합니다."

### Part 10. 마무리 리팩터링 포인트 정리

기능이 완성되면 마지막 10분은 반드시 구조를 다시 정리한다.

정리할 내용

- `App.vue`의 책임이 줄어들었는가
- 공유 상태와 로컬 상태가 구분되었는가
- URL만 보고도 현재 화면을 설명할 수 있는가
- 새로고침 후에도 동일한 상태를 복원할 수 있는가

이 단계에서 단순 동작 확인으로 끝내지 말고, 구조적 변화가 무엇인지 언어로 다시 설명하게 만든다.

## 수업 중 계속 던질 질문

- 이 책임은 별도 컴포넌트로 나누는 편이 자연스러운가
- 이 값은 여러 화면이 함께 써야 하는 상태인가
- 이 데이터는 저장돼야 하는가, 잠깐만 필요할 뿐인가
- 지금 이 기능은 목록 화면 책임인가, 상세 화면 책임인가
- URL이 바뀌어야 하는 상황인가, 같은 화면 안 상태 변화인가
- 지금 사용한 도구가 없으면 코드가 어디에 몰리게 되는가

## 최소 완료 기준

- Pinia가 정상 등록되어 있다.
- Todo 목록 상태가 store에서 관리된다.
- LocalStorage와 연동되어 새로고침 후 데이터가 유지된다.
- Todo 항목에 `memo` 필드가 존재한다.
- 목록 페이지와 상세 페이지가 Router로 분리되어 있다.
- 상세 페이지에서 특정 Todo를 찾아 메모를 수정할 수 있다.

## 여유가 있을 때 확장할 내용

- 필터 상태를 query string으로 반영하기
- 최근 수정 시간 표시하기
- 존재하지 않는 경로용 NotFound 페이지 추가하기
- Pinia plugin 형태로 저장 로직 분리하기
- 목록 카드에 메모 미리보기 추가하기

## 강사용 주의 포인트

- 컴포넌트 분리와 store 도입을 같은 것으로 설명하지 않는다.
- 먼저 화면 책임을 나누고, 그다음 공유 상태를 store로 올린다.
- Pinia와 Router를 설치한 뒤 곧바로 문법 설명으로 길게 들어가지 않는다.
- 먼저 기존 구조의 불편함을 확인시키고 도구를 투입한다.
- LocalStorage는 쉬워 보여도 예외 처리와 책임 분리가 중요하다는 점을 짚는다.
- `index` 기반 구현을 그대로 두면 상세 페이지에서 반드시 문제가 생긴다는 점을 강조한다.
- 한 회차 안에서 컴포넌트 분리를 과도하게 밀어붙이지 않는다. 이번 회차 핵심은 생태계 도구 연결이다.

## 마무리 정리 멘트

- "오늘은 기능을 조금 더 만든 것이 아니라, 앱이 커질 때 필요한 구조를 추가한 시간입니다."
- "Pinia는 상태를 나누기 위한 도구였고, Vue Router는 화면을 나누기 위한 도구였습니다."
- "이제 Todo 앱은 단순 예제가 아니라, 여러 화면과 저장소를 가진 작은 애플리케이션 구조로 바뀌었습니다."
