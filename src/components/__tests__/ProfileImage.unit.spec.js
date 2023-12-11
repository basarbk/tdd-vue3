import { render, screen } from '@testing-library/vue'
import ProfileImage from '../ProfileImage.vue'

describe('ProfileImage', () => {
  describe('when tempImage is undefined', () => {
    describe('when user image is undefined', () => {
      it('displays default profile image', () => {
        render(ProfileImage)
        const image = screen.getByAltText('image')
        expect(image).toHaveAttribute('src', '/assets/profile.png')
      })
    })

    describe('when user image is set', () => {
      it('displays users image', () => {
        render(ProfileImage, { props: { image: 'user-image.png' } })
        const image = screen.getByAltText('image')
        expect(image).toHaveAttribute('src', '/images/user-image.png')
      })

      describe('when user has temp image', () => {
        it('displays temp image', async () => {
          const { rerender } = render(ProfileImage, { props: { image: 'user-image.png' } })
          await rerender({ image: 'user-image.png', tempImage: 'base64-encoded-file' })
          const image = screen.getByAltText('image')
          expect(image).toHaveAttribute('src', 'base64-encoded-file')
        })
      })
    })
  })

  describe('when temp Image is set', () => {
    it('displays temp image', () => {
      render(ProfileImage, { props: { tempImage: 'base64-encoded-file' } })
      const image = screen.getByAltText('image')
      expect(image).toHaveAttribute('src', 'base64-encoded-file')
    })
  })
})
