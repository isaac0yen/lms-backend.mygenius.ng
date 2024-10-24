import { DateTime } from 'luxon';
import { db } from '../modules/Database.js';
import ThrowError from '../modules/ThrowError.js';
import { FileOperations } from '../modules/FileName.js';
import { MAX_FILE_SIZE_IN_MB } from '../settings/index.js';

export default {
  Query: {
    announcements: async (_, { classId }) => {
      const query = classId ? { class_id: classId } : {};
      const announcements = await db.findMany('announcements', query);
      return announcements;
    },

    announcement: async (_, { id }) => {
      const announcement = await db.findOne('announcements', { id });
      if (!announcement) {
        ThrowError('Announcement not found');
      }
      return announcement;
    }
  },

  Mutation: {
    createAnnouncement: async (_, { title, body, classId, attachments }, context) => {
      if (context.user.role !== 'ADMIN') {
        ThrowError('Only admins can create announcements');
      }

      const announcement = {
        title,
        body,
        class_id: classId,
        created_by: context.user.id,
        created_at: DateTime.now().setZone('Africa/Lagos').toJSDate()
      };

      const announcementId = await db.insertOne('announcements', announcement);

      if (attachments && attachments.length > 0) {
        for (const file of attachments) {
          const { filename, createReadStream } = await file;
          const stream = createReadStream();
          
          // Get file size in bytes and convert to MB
          const chunks = [];
          for await (const chunk of stream) {
            chunks.push(chunk);
          }
          const fileSize = Buffer.concat(chunks).length / (1024 * 1024);

          if (fileSize > MAX_FILE_SIZE_IN_MB) {
            ThrowError(`File size exceeds maximum limit of ${MAX_FILE_SIZE_IN_MB}MB`);
          }

          await FileOperations.writeFile('../lms_files/' + filename, Buffer.concat(chunks).toString());

          await db.insertOne('announcement_attachments', {
            announcement_id: announcementId,
            file_name: filename,
            file_path: `/uploads/${filename}`,
            file_type: filename.split('.').pop(),
            created_at: DateTime.now().setZone('Africa/Lagos').toJSDate()
          });
        }
      }

      return {
        ...announcement,
        id: announcementId
      };
    }  }};