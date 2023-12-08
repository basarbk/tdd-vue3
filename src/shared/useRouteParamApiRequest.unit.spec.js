vi.mock('vue-i18n')
vi.mock('vue-router')
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import en from '@/locales/translations/en.json'
import { reactive } from 'vue'
import useRouteParamApiRequest from './useRouteParamApiRequest'
import { waitFor } from '@testing-library/vue'

vi.mocked(useI18n).mockReturnValue({
  t: (key) => en[key]
})

const route = reactive({
  params: {
    token: '123'
  }
})

vi.mocked(useRoute).mockReturnValue(route)

describe('useRouteParamApiRequest', () => {
  it('calls apiFn with expected params', () => {
    const mockApiFn = vi.fn()
    useRouteParamApiRequest(mockApiFn, 'token')
    expect(mockApiFn).toHaveBeenCalledWith('123')
  })

  describe('when route is changed', () => {
    it('calls apiFn with new params', async () => {
      const mockApiFn = vi.fn()
      useRouteParamApiRequest(mockApiFn, 'token')
      route.params.token = '456'
      await waitFor(() => {
        expect(mockApiFn).toHaveBeenCalledWith('456')
      })
    })
  })

  describe('when apiFn in progress', () => {
    it('should return expected result', () => {
      const mockApiFn = vi.fn()
      const { status, data, error } = useRouteParamApiRequest(mockApiFn, 'token')
      expect(status.value).toBe('loading')
      expect(data.value).toBe(undefined)
      expect(error.value).toBe(undefined)
    })
  })

  describe('when apiFn resolves', () => {
    it('should return expected result', async () => {
      const mockApiFn = vi.fn().mockResolvedValue({ data: { message: 'success message' } })
      const { status, data, error } = useRouteParamApiRequest(mockApiFn, 'token')
      await waitFor(() => {
        expect(status.value).toBe('success')
        expect(data.value).toStrictEqual({ message: 'success message' })
        expect(error.value).toBe(undefined)
      })
    })
  })

  describe('when apiFn rejects', () => {
    describe('when response message exists', () => {
      it('should return expected result', async () => {
        const mockApiFn = vi
          .fn()
          .mockRejectedValue({ response: { data: { message: 'error message' } } })
        const { status, data, error } = useRouteParamApiRequest(mockApiFn, 'token')
        await waitFor(() => {
          expect(status.value).toBe('fail')
          expect(data.value).toBeUndefined()
          expect(error.value).toBe('error message')
        })
      })
    })

    describe('when response message exists', () => {
      it('should return expected result', async () => {
        const mockApiFn = vi.fn().mockRejectedValue({})
        const { status, data, error } = useRouteParamApiRequest(mockApiFn, 'token')
        await waitFor(() => {
          expect(status.value).toBe('fail')
          expect(data.value).toBeUndefined()
          expect(error.value).toBe('Unexpected error occurred, please try again')
        })
      })
    })
  })
})
